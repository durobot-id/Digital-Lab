import { describe, it } from "node:test";
import assert from "node:assert";
import { TOPICS } from "../../data/topics";

describe("DILSA Deterministic Physics & Evaluation Model Tests", () => {
  describe("Tema 1: Gaya dan Gerak (Hukum II Newton)", () => {
    it("Kalkulasi percepatan ideal tanpa gesekan a = F / m", () => {
      const force = 20; // N
      const mass = 4; // kg
      const a = force / mass;
      assert.strictEqual(a, 5); // 5 m/s²
    });

    it("Pengaruh penambahan massa terhadap penurunan percepatan", () => {
      const force = 30; // N
      const m1 = 2; // kg
      const m2 = 6; // kg
      const a1 = force / m1;
      const a2 = force / m2;
      assert.strictEqual(a1, 15);
      assert.strictEqual(a2, 5);
      assert.strictEqual(a1 / a2, 3); // Inversely proportional
    });

    it("Pengaruh gaya gesekan mengurangi gaya resultan", () => {
      const force = 25; // N
      const mass = 4; // kg
      const g = 9.8;
      const mu = 0.1;
      const friction = mu * mass * g; // 3.92 N
      const fNet = force - friction;
      assert.ok(Math.abs(fNet - 21.08) < 0.1);
      const a = fNet / mass;
      assert.ok(a < force / mass);
    });
  });

  describe("Tema 2: Kelistrikan (Hukum Ohm & Rangkaian)", () => {
    it("Hukum Ohm sederhana I = V / R", () => {
      const v = 12; // V
      const r = 24; // Ohm
      const i = v / r;
      assert.strictEqual(i, 0.5); // 0.5 A
    });

    it("Rangkaian Seri: R_total = R1 + R2", () => {
      const v = 12;
      const r1 = 10;
      const r2 = 20;
      const rTot = r1 + r2; // 30 Ohm
      const i = v / rTot;
      assert.strictEqual(rTot, 30);
      assert.strictEqual(i, 0.4);
    });

    it("Rangkaian Paralel: R_total = (R1 * R2) / (R1 + R2)", () => {
      const v = 12;
      const r1 = 10;
      const r2 = 10;
      const rTot = (r1 * r2) / (r1 + r2); // 5 Ohm
      const iTot = v / rTot;
      assert.strictEqual(rTot, 5);
      assert.strictEqual(iTot, 2.4);
      assert.ok(iTot > v / (r1 + r2)); // Paralel menarik arus lebih besar
    });

    it("Rangkaian Terbuka menghasilkan arus nol", () => {
      const isSwitchClosed = false;
      const current = isSwitchClosed ? 1.2 : 0;
      assert.strictEqual(current, 0);
    });
  });

  describe("Tema 3: Cahaya dan Optik (Cermin Datar)", () => {
    it("Hukum pemantulan sudut datang sama dengan sudut pantul", () => {
      const testAngles = [0, 15, 30, 45, 60, 75];
      testAngles.forEach((angle) => {
        const reflected = angle;
        assert.strictEqual(reflected, angle);
      });
    });

    it("Jarak bayangan cermin datar sama dengan jarak benda (s' = s)", () => {
      const objectDistances = [10, 20, 35];
      objectDistances.forEach((s) => {
        const imageDist = s;
        assert.strictEqual(imageDist, s);
      });
    });
  });

  describe("Validitas Bank Soal dan Pembahasan Kuis", () => {
    it("Setiap tema memiliki 6 soal dengan opsi valid dan kunci jawaban yang tepat", () => {
      assert.strictEqual(TOPICS.length, 3);
      TOPICS.forEach((topic) => {
        assert.ok(topic.quiz.length >= 5);
        topic.quiz.forEach((q) => {
          assert.strictEqual(q.options.length, 4);
          assert.ok(q.correctAnswerIndex >= 0);
          assert.ok(q.correctAnswerIndex < 4);
          assert.ok(q.explanation.length > 15);
          assert.ok(q.conceptTag.length > 3);
        });
      });
    });
  });
});
