"""HTTP contract tests for the decision screen."""
from __future__ import annotations

import json
import os
import tempfile
import threading
import unittest
from http.client import HTTPConnection
from pathlib import Path

from nexus_loop.app import ReportStore, make_handler
from http.server import ThreadingHTTPServer

MIN_REPORT = {
    "team": "test",
    "corpus": "x",
    "generated_at": "2026-01-01T00:00:00Z",
    "system_notes": "",
    "metrics": [],
    "findings": [{"id": "f1", "is_regression": True}],
    "diagnoses": [{"id": "d1", "finding_id": "f1"}],
    "gaps": [],
    "standard": [],
    "prescriptions": [{
        "id": "p01_ok",
        "diagnosis_id": "d1",
        "change_type": "tool.validate",
        "target": "t",
        "description": "d",
        "predicted_delta": {"metric": "resolution_rate", "from": 0.1, "to": 0.2},
        "decision": {
            "asking_approval_for": "x",
            "risk_if_diagnosis_wrong": "y",
            "would_not_ship_if": "z",
        },
        "cohort": {},
    }],
    "verifications": [],
    "self_assessment": {"cycles": 0, "prescription_accuracy": {}, "downweighted": []},
}


class ScreenHttp(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.report = os.path.join(self.tmp.name, "loop-report.json")
        Path(self.report).write_text(json.dumps(MIN_REPORT), encoding="utf-8")
        store = ReportStore(self.report, schema_path=None)
        self.httpd = ThreadingHTTPServer(("127.0.0.1", 0), make_handler(store))
        self.port = self.httpd.server_address[1]
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.tmp.cleanup()

    def _conn(self):
        return HTTPConnection("127.0.0.1", self.port, timeout=5)

    def _json(self, method, path, body=None, headers=None):
        c = self._conn()
        raw = None if body is None else json.dumps(body).encode()
        hdrs = dict(headers or {})
        if raw is not None:
            hdrs.setdefault("Content-Type", "application/json")
            hdrs["Content-Length"] = str(len(raw))
        c.request(method, path, body=raw, headers=hdrs)
        r = c.getresponse()
        data = r.read()
        c.close()
        return r.status, dict(r.getheaders()), data

    def test_finding_tabs_and_idle_copy(self):
        st, _, body = self._json("GET", "/")
        page = body.decode()
        self.assertEqual(st, 200)
        self.assertIn("`To decide (${regs.length})`", page)
        self.assertIn("`All clear (${dismissed.length})`", page)
        self.assertIn("`No number (${gaps.length})`", page)
        self.assertNotIn("`Not a problem (${dismissed.length})`", page)
        self.assertNotIn("`We will not invent (${gaps.length})`", page)
        self.assertNotIn("We would not guess", page)
        self.assertIn("Nothing to approve. This is not a problem.", page)
        self.assertIn("Nothing to approve. We will not invent a failover rate.", page)
        self.assertIn("Nothing to approve. We will not invent this number.", page)
        self.assertIn('"Nothing to approve. " + gapClaim(g) + "."', page)
        self.assertIn('g.ask_id === "A11" || g.verdict === "NOT_MEASURABLE"', page)
        self.assertIn('pack.kind === "dismissed" || !pack.p', page)
        self.assertNotIn("Nothing to approve. This is all clear.", page)
        self.assertNotIn("Nothing to approve on this finding.", page)
        self.assertIn("We will not invent a failover rate", page)
        self.assertIn(">all clear<", page)
        self.assertIn(">no number<", page)
        self.assertNotIn(">not a problem<", page)
        self.assertIn('pack.kind === "gap"', page)
        self.assertIn('pack.kind === "dismissed"', page)
        self.assertIn("content-visibility: auto", page)
        self.assertIn("list-body", page)
        self.assertIn("-webkit-line-clamp: 2;", page)
        self.assertIn("toManagerEnglish", page)
        self.assertIn("audienceFor", page)

    def test_idle_gate_copy_is_two_states(self):
        st, _, body = self._json("GET", "/")
        page = body.decode()
        self.assertEqual(st, 200)
        self.assertIn("function idleGateCopy(pack)", page)
        self.assertIn('g.ask_id === "A11" || g.verdict === "NOT_MEASURABLE"', page)
        self.assertIn("Nothing to approve. We will not invent a failover rate.", page)
        self.assertIn("Nothing to approve. This is not a problem.", page)
        self.assertIn('pack.kind === "dismissed" || !pack.p', page)
        self.assertNotIn("Nothing to approve — we would not guess this number", page)
        self.assertNotIn("Nothing to approve. This is all clear.", page)
        self.assertNotIn("Nothing to approve on this finding.", page)

    def test_get_page_and_security_headers(self):
        st, hdrs, body = self._json("GET", "/")
        lower = {k.lower(): v for k, v in hdrs.items()}
        self.assertEqual(st, 200)
        self.assertIn(b"<html", body.lower())
        self.assertEqual(lower.get("x-content-type-options"), "nosniff")
        self.assertEqual(lower.get("x-frame-options"), "DENY")
        self.assertIn("default-src 'none'", lower.get("content-security-policy", ""))

    def test_health_does_not_leak_path(self):
        st, _, data = self._json("GET", "/health")
        self.assertEqual(st, 200)
        obj = json.loads(data)
        self.assertTrue(obj["ok"])
        self.assertTrue(obj["report"])
        self.assertNotIn(self.tmp.name, data.decode())

    def test_unknown_path_404(self):
        st, _, data = self._json("GET", "/etc/passwd")
        self.assertEqual(st, 404)
        self.assertEqual(json.loads(data)["error"], "not_found")

    def test_wrong_method_405(self):
        st, hdrs, _ = self._json("POST", "/report.json")
        lower = {k.lower(): v for k, v in hdrs.items()}
        self.assertEqual(st, 405)
        self.assertIn("GET", lower.get("allow", ""))

    def test_decision_write_back_and_empty_reason(self):
        st, _, data = self._json("POST", "/decision", {
            "prescription_id": "p01_ok", "verdict": "accepted",
            "decided_by": "testbed", "reason": "ok",
        })
        self.assertEqual(st, 200, data)
        st2, _, _ = self._json("POST", "/decision", {
            "prescription_id": "p01_ok", "verdict": "rejected",
            "decided_by": "testbed", "reason": "",
        })
        self.assertEqual(st2, 400)

    def test_payload_too_large(self):
        c = self._conn()
        c.putrequest("POST", "/decision")
        c.putheader("Content-Type", "application/json")
        c.putheader("Content-Length", str(70 * 1024))
        c.endheaders()
        c.send(b"x" * 1024)
        r = c.getresponse()
        self.assertEqual(r.status, 413)
        c.close()

    def test_script_in_reason_is_stored_as_text(self):
        payload = {
            "prescription_id": "p01_ok", "verdict": "deferred",
            "decided_by": "operator",
            "reason": "<script>alert(1)</script>",
        }
        st, _, data = self._json("POST", "/decision", payload)
        self.assertEqual(st, 200, data)
        saved = json.loads(Path(self.report).read_text())
        self.assertEqual(saved["prescriptions"][0]["approval"]["reason"], payload["reason"])

    def test_tech_names_are_a_visible_story_footer(self):
        st, _, body = self._json("GET", "/")
        page = body.decode()
        self.assertEqual(st, 200)
        self.assertIn('class="tech-foot"', page)
        self.assertIn("function pinStoryLayout", page)
        self.assertIn(".story-scroll", page)
        self.assertIn("flex-direction: column", page)
        self.assertNotIn('details("Technical names"', page)
        self.assertIn("min-height: 10rem", page)
        self.assertIn('{ k: "fields", v: (ev.fields || []).join(", ") }', page)
        self.assertIn("overflow-x: auto", page)

    def test_list_body_wrapper_in_served_html(self):
        st, _, body = self._json("GET", "/")
        page = body.decode()
        self.assertEqual(st, 200)
        self.assertIn(".list-body {", page)
        self.assertIn('</div><div class="list-body">${items.join("")', page)
        self.assertIn("overflow-y: auto", page)

    def test_gap_lede_and_first_beat_helpers(self):
        st, _, body = self._json("GET", "/")
        page = body.decode()
        self.assertEqual(st, 200)
        self.assertIn("const GAP_LEDE = {", page)
        self.assertIn(
            'A11: "Failover does not exist here. There is no rate to show."',
            page,
        )
        self.assertIn("function gapLede(g)", page)
        self.assertIn("GAP_LEDE[g.ask_id]", page)
        self.assertIn("function firstBeat(s, max)", page)
        self.assertIn("${esc(gapLede(g))}", page)

    def test_list_keyboard_navigation_bound(self):
        st, _, body = self._json("GET", "/")
        page = body.decode()
        self.assertEqual(st, 200)
        self.assertIn("function bindListKeys(rep)", page)
        self.assertIn("bindListKeys(rep);", page)
        self.assertIn('$("list").addEventListener("keydown"', page)
        self.assertIn('ev.key !== "ArrowDown"', page)
        self.assertIn('ev.key !== "ArrowUp"', page)
        self.assertIn('ev.key !== "Home"', page)
        self.assertIn('ev.key !== "End"', page)

    def test_finding_tab_label_contract(self):
        st, _, body = self._json("GET", "/")
        page = body.decode()
        self.assertEqual(st, 200)
        self.assertIn("`All clear (${dismissed.length})`", page)
        self.assertIn("`No number (${gaps.length})`", page)
        self.assertNotIn("`Not a problem (${dismissed.length})`", page)
        self.assertNotIn("`We will not invent (${gaps.length})`", page)
        self.assertNotIn("We would not guess", page)


if __name__ == "__main__":
    unittest.main()
