import { NextRequest, NextResponse } from "next/server";

interface AssistantRequest {
  message: string;
  topic: string;
  parameters?: Record<string, any>;
  measurements?: Record<string, any>;
  activeStep?: number;
}

// Fallback pedagogical response engine when AI API key is not configured or offline
function generateHeuristicResponse(
  message: string,
  topic: string,
  params: Record<string, any> = {},
  measurements: Record<string, any> = {},
  activeStep: number = 1
): string {
  const query = message.toLowerCase();

  if (topic === "gaya-dan-gerak") {
    const f = params.gayaDorong_N ?? 20;
    const m = params.massa_kg ?? 4;
    const a = measurements.percepatan_ms2 ?? (f / m).toFixed(2);
    const fNet = measurements.gayaResultan_N ?? f;

    if (query.includes("jelaskan") || query.includes("hasil") || query.includes("mengapa")) {
      return `Berdasarkan Hukum II Newton (F = m × a), gaya dorong total saat ini adalah ${fNet} N yang bekerja pada massa ${m} kg. 
      
Menghasilkan percepatan a = F / m = ${fNet} N / ${m} kg = ${a} m/s². 

Perhatikan bahwa jika kamu memperbesar gaya dorong, percepatan balok akan meningkat searah gaya. Coba prediksi: menurutmu apa yang terjadi jika massanya kita gandakan menjadi ${m * 2} kg?`;
    }

    if (query.includes("petunjuk") || query.includes("langkah") || query.includes("berikutnya")) {
      if (activeStep === 1) {
        return `Untuk Langkah 1 (Pengaruh Besar Gaya): Pertahankan massa tetap (misal 2 kg), lalu variasikan gaya dorong dari 10 N ke 20 N dan 30 N. Catat nilai percepatannya pada tombol 'Catat Titik Data'. Apakah percepatannya naik 2 kali lipat saat gayanya diduakan?`;
      }
      if (activeStep === 2) {
        return `Untuk Langkah 2 (Pengaruh Massa): Kunci gaya dorong di angka 20 N, lalu geser slider massa dari 2 kg ke 4 kg hingga 8 kg. Amati bagaimana benda yang lebih berat terasa lebih lambat menambah kecepatannya (inersia bertambah).`;
      }
      return `Untuk Langkah 3 (Uji Gesekan): Coba aktifkan mode 'Gesekan Rendah' atau 'Gesekan Kasar'. Perhatikan panah merah gaya gesek yang selalu melawan arah gerak dan mengurangi percepatan neto benda!`;
    }

    return `Saat ini balok bermassa ${m} kg didorong dengan gaya ${f} N, menghasilkan percepatan ${a} m/s². 

Ingat rumusnya: a = F_net / m. Apa yang ingin kamu uji selanjutnya? Kamu bisa mencoba menaikkan massa atau mengubah permukaan menjadi bergesekan!`;
  }

  if (topic === "kelistrikan") {
    const v = params.teganganBaterai_V ?? 12;
    const i = measurements.kuatArusTotal_A ?? 0;
    const rTot = measurements.hambatanTotal_Ohm ?? 0;
    const type = params.tipeRangkaian ?? "seri";
    const status = params.statusSakelar ?? "Tertutup";

    if (query.includes("jelaskan") || query.includes("hasil") || query.includes("mengapa")) {
      if (status.includes("Terbuka")) {
        return `Sakelar saat ini dalam keadaan terbuka! Dalam keadaan ini, rangkaian listrik terputus sehingga tidak ada muatan yang dapat bersirkulasi (kuat arus I = 0 A). Lampu tidak dapat menyala tanpa lintasan sirkuit yang tertutup.`;
      }
      return `Rangkaian ${type} sedang dialiri arus dari sumber ${v} Volt. Hambatan total rangkaian yang terukur adalah ${rTot} Ω. 

Berdasarkan Hukum Ohm (I = V / R), kuat arus yang mengalir adalah I = ${v}V / ${rTot}Ω = ${i} Ampere. 
${
  type === "parallel"
    ? "Pada susunan paralel, kedua lampu mendapatkan tegangan penuh baterai sehingga menyala lebih benderang dibanding jika dipasang seri!"
    : "Pada susunan seri, tegangan terbagi di antara lampu-lampu sehingga nyalanya lebih redup."
}`;
    }

    if (query.includes("petunjuk") || query.includes("langkah")) {
      return `Coba bandingkan rangkaian Seri dan Paralel dengan nilai lampu yang sama (${params.hambatanLampu1_Ohm ?? 10} Ω). Perhatikan bagaimana nilai kuat arus total pada ammeter melonjak jauh lebih tinggi ketika dipasang paralel karena hambatan totalnya mengecil!`;
    }

    return `Pada rangkaian ${type} ini, tegangan sumber adalah ${v} V dan arus yang mengalir adalah ${i} A. Sakelar dalam status ${status}. Ada konsep atau percobaan kelistrikan yang ingin kita bedah bersama?`;
  }

  if (topic === "cahaya-dan-optik") {
    const iAngle = params.sudutDatang_derajat ?? 45;
    const rAngle = measurements.sudutPantul_derajat ?? iAngle;
    const s = params.jarakBenda_cm ?? 20;

    if (query.includes("jelaskan") || query.includes("hasil") || query.includes("hukum")) {
      return `Hukum Pemantulan Cahaya menyatakan bahwa sudut datang (i) selalu sama persis dengan sudut pantul (r) jika diukur terhadap garis normal yang tegak lurus cermin. 

Saat ini sudut datang laser adalah ${iAngle}°, sehingga sudut pantulnya pasti ${rAngle}°. 
Perhatikan garis normal titik-titik di tengah: kedua sudut diukur mengapit garis normal tersebut, bukan dari permukaan kaca cermin!`;
    }

    if (query.includes("bayangan") || query.includes("maya") || query.includes("jarak")) {
      return `Pada cermin datar, jarak bayangan di belakang cermin (s' = ${s} cm) selalu sama persis dengan jarak benda di depan cermin (s = ${s} cm). 

Bayangan ini bersifat MAYA (virtual) karena dibentuk dari perpanjangan garis khayal sinar di balik cermin, TEGAK, dan SAMA BESAR dengan benda aslinya.`;
    }

    return `Eksperimen optik cermin datar: Sudut datang i = ${iAngle}° menghasilkan sudut pantul r = ${rAngle}°. Apakah kamu ingin mencoba menyalakan Busur Derajat untuk mengukur ketepatan sudutnya?`;
  }

  return `Halo! Saya Asisten Laboratorium DILSA. Saya siap membimbingmu memahami konsep eksperimen ini langkah demi langkah berdasarkan data yang kamu ukur. Apa yang ingin kamu tanyakan atau eksplorasi?`;
}

export async function POST(req: NextRequest) {
  try {
    const body: AssistantRequest = await req.json();
    const { message, topic, parameters, measurements, activeStep } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    // Check if an AI API Key (Gemini) is available in environment
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      try {
        const systemPrompt = `Kamu adalah Asisten Laboratorium DILSA (Digital Laboratorium Science AI) untuk siswa SMP/MTs (kelas VII-IX).
Pedoman interaksi:
1. Bersahabat, mendidik, sopan, bernada ilmiah tetapi mudah dipahami remaja SMP.
2. JANGAN PERNAH memakai emoji atau emotikon apa pun.
3. Gunakan pola sokratik: Pahami -> Arahkan -> Tanyakan prediksi -> Hubungkan rumus -> Refleksikan.
4. Gunakan nilai parameter dan pengukuran resmi yang dikirimkan sistem. Jangan mengarang angka atau rumus fiktif.
5. JANGAN langsung membocorkan jawaban kuis jika siswa bertanya jawaban kuis; berikan petunjuk konsepnya.
6. Asumsi model adalah simulasi deterministik 2D ideal.

Konteks Laboratorium:
- Topik: ${topic}
- Parameter aktif: ${JSON.stringify(parameters || {})}
- Hasil pengukuran saat ini: ${JSON.stringify(measurements || {})}
- Langkah eksperimen aktif: ${activeStep || 1}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `${systemPrompt}\n\nPertanyaan siswa: ${message}`
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 500
              }
            })
          }
        );

        if (res.ok) {
          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            // Strip any accidental emojis if generated
            const cleaned = reply.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
            return NextResponse.json({ reply: cleaned, source: "ai_provider" });
          }
        }
      } catch (err) {
        console.warn("AI provider call failed, falling back to heuristic engine", err);
      }
    }

    // Fallback heuristic engine
    const heuristicReply = generateHeuristicResponse(
      message,
      topic,
      parameters,
      measurements,
      activeStep
    );

    return NextResponse.json({ reply: heuristicReply, source: "deterministic_engine" });
  } catch (error) {
    console.error("Assistant API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses permintaan asisten" },
      { status: 500 }
    );
  }
}
