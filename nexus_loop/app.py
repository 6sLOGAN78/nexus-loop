"""Decision screen: one stdlib HTTP server, report as the source of truth.

GET  /              the operator screen (static/index.html)
GET  /report.json   the current loop-report.json
POST /decision      write approval back: read → update that prescription only →
                    temp file → atomic replace → re-validate → append decisions.log
"""
from __future__ import annotations

import datetime as dt
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Optional
from urllib.parse import urlparse

from .validate import extra_checks, load_schema, validate

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
VERDICTS = {"accepted", "rejected", "deferred"}


class ReportStore:
    def __init__(self, report_path: str, schema_path: Optional[str] = None):
        self.report_path = os.path.abspath(report_path)
        self.schema_path = schema_path
        self.schema = load_schema(schema_path) if schema_path and os.path.exists(schema_path) else None
        self.log_path = os.path.join(os.path.dirname(self.report_path), "decisions.log")

    def load(self) -> dict:
        with open(self.report_path, encoding="utf-8") as fh:
            return json.load(fh)

    def decide(self, prescription_id: str, verdict: str, decided_by: str, reason: str) -> dict:
        if verdict not in VERDICTS:
            raise ValueError("verdict must be one of %s" % sorted(VERDICTS))
        if not (reason or "").strip():
            raise ValueError("a reason is required")
        if not (prescription_id or "").strip():
            raise ValueError("prescription_id is required")
        report = self.load()
        target = None
        for p in report.get("prescriptions") or []:
            if p.get("id") == prescription_id:
                target = p
                break
        if target is None:
            raise KeyError("no prescription %s" % prescription_id)
        at = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        target["approval"] = {
            "verdict": verdict,
            "decided_by": (decided_by or "operator").strip(),
            "reason": reason.strip(),
            "at": at,
        }
        problems = extra_checks(report)
        if self.schema:
            problems = validate(report, self.schema) + problems
        if problems:
            raise ValueError("report would be invalid after write-back: " + "; ".join(problems[:8]))
        os.makedirs(os.path.dirname(self.report_path) or ".", exist_ok=True)
        tmp = self.report_path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as fh:
            json.dump(report, fh, indent=2, allow_nan=False)
            fh.write("\n")
        os.replace(tmp, self.report_path)
        os.makedirs(os.path.dirname(self.log_path) or ".", exist_ok=True)
        with open(self.log_path, "a", encoding="utf-8") as fh:
            fh.write(json.dumps({
                "at": at, "prescription_id": prescription_id, "verdict": verdict,
                "decided_by": target["approval"]["decided_by"], "reason": reason.strip(),
            }, sort_keys=True) + "\n")
        return target["approval"]


def make_handler(store: ReportStore):
    class H(BaseHTTPRequestHandler):
        def _send(self, code: int, body: bytes, content_type: str) -> None:
            self.send_response(code)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def _json(self, code: int, obj: dict) -> None:
            self._send(code, json.dumps(obj, indent=2).encode("utf-8"),
                       "application/json; charset=utf-8")

        def do_GET(self):
            path = urlparse(self.path).path
            if path in ("/", "/index.html"):
                page = os.path.join(STATIC_DIR, "index.html")
                with open(page, "rb") as fh:
                    return self._send(200, fh.read(), "text/html; charset=utf-8")
            if path == "/report.json":
                try:
                    body = json.dumps(store.load()).encode("utf-8")
                except OSError as e:
                    return self._json(404, {"error": "report_missing", "detail": str(e)})
                return self._send(200, body, "application/json; charset=utf-8")
            if path == "/health":
                return self._json(200, {"ok": True, "report": store.report_path})
            return self._json(404, {"error": "not_found"})

        def do_POST(self):
            path = urlparse(self.path).path
            if path != "/decision":
                return self._json(404, {"error": "not_found"})
            n = int(self.headers.get("Content-Length") or 0)
            raw = self.rfile.read(n) if n else b"{}"
            try:
                body = json.loads(raw.decode("utf-8") or "{}")
            except ValueError as e:
                return self._json(400, {"error": "bad_json", "detail": str(e)})
            try:
                approval = store.decide(
                    str(body.get("prescription_id") or ""),
                    str(body.get("verdict") or ""),
                    str(body.get("decided_by") or "operator"),
                    str(body.get("reason") or ""),
                )
            except KeyError as e:
                return self._json(404, {"error": "unknown_prescription", "detail": str(e)})
            except ValueError as e:
                return self._json(400, {"error": "invalid_decision", "detail": str(e)})
            return self._json(200, {"ok": True, "approval": approval})

        def log_message(self, *a):
            pass
    return H


def serve(report_path: str, schema_path: Optional[str] = None, port: int = 8765,
          host: str = "127.0.0.1") -> None:
    store = ReportStore(report_path, schema_path)
    httpd = ThreadingHTTPServer((host, port), make_handler(store))
    httpd.serve_forever()


def main(argv=None) -> int:
    import argparse
    ap = argparse.ArgumentParser(description="Nexus Loop decision screen")
    ap.add_argument("--report", default="out/loop-report.json")
    ap.add_argument("--schema", default="tools/nexus-loop-kit/schema/loop-report.schema.json")
    ap.add_argument("--port", type=int, default=8765)
    ap.add_argument("--host", default="127.0.0.1")
    a = ap.parse_args(argv)
    print("decision screen http://%s:%d  (report %s)" % (a.host, a.port, a.report))
    serve(a.report, a.schema, a.port, a.host)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
