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

Perhatikan bahwa jika kamu memperbesar gaya dorong, percepatan balok akan meningkat searah gaya. Coba amati apa yang terjadi jika massanya kita gandakan menjadi ${m * 2} kg!`;
    }

    if (query.includes("petunjuk") || query.includes("langkah") || query.includes("berikutnya")) {
      if (activeStep === 1) {
        return `Untuk Langkah 1: Pertahankan massa tetap (misal 2 kg), lalu variasikan gaya dorong dari 10 N ke 20 N dan 30 N. Catat nilai percepatannya. Apakah percepatannya berlipat ganda?`;
      }
      if (activeStep === 2) {
        return `Untuk Langkah 2: Kunci gaya dorong di angka 20 N, lalu geser massa dari 2 kg ke 4 kg hingga 8 kg. Amati bagaimana benda yang lebih berat terasa lebih lambat menambah kecepatannya (inersia bertambah).`;
      }
      return `Untuk Langkah 3: Coba aktifkan mode 'Gesekan Rendah' atau 'Gesekan Kasar'. Perhatikan panah merah gaya gesek yang selalu melawan arah gerak dan mengurangi percepatan neto benda!`;
    }

    return `Saat ini balok bermassa ${m} kg didorong dengan gaya ${f} N, menghasilkan percepatan ${a} m/s². 

Ingat rumusnya: a = F_net / m. Kamu bisa mencoba menggeser balok atau mengubah gaya gesek lintasan!`;
  }

  if (topic === "kelistrikan") {
    const v = params.teganganBaterai_V ?? 12;
    const i = measurements.kuatArusTotal_A ?? 0;
    const rTot = measurements.hambatanTotal_Ohm ?? 0;
    const type = params.tipeRangkaian ?? "seri";
    const status = params.statusSakelar ?? "Tertutup";

    if (query.includes("jelaskan") || query.includes("hasil") || query.includes("mengapa")) {
      if (status.includes("Terbuka") || i === 0) {
        return `Rangkaian saat ini terbuka atau kabel belum terhubung membentuk sirkuit tertutup. Arus listrik bernilai 0 Ampere. Muatan hanya dapat mengalir jika kutub positif baterai tersambung melalui komponen kembali ke kutub negatif.`;
      }
      return `Rangkaian ${type} sedang dialiri arus dari baterai ${v} Volt. Hambatan total adalah ${rTot} Ω. 

Berdasarkan Hukum Ohm (I = V / R), arus yang mengalir adalah I = ${v}V / ${rTot}Ω = ${i} Ampere. Lampu menyala sesuai daya yang diserapnya!`;
    }

    if (query.includes("petunjuk") || query.includes("sambung") || query.includes("kabel")) {
      return `Untuk menghubungkan komponen: Klik salah satu terminal pin komponen (titik merah/biru), lalu klik terminal komponen lain untuk menyambungkan kabel. Pastikan baterai, sakelar, dan lampu membentuk lingkaran tertutup!`;
    }

    return `Pada rangkaian ini, tegangan sumber adalah ${v} V dan arus adalah ${i} A. Status sakelar: ${status}. Silakan coba sambungkan kabel atau atur komponen di meja kerja!`;
  }

  if (topic === "cahaya-dan-optik") {
    const iAngle = params.sudutDatang_derajat ?? 45;
    const rAngle = measurements.sudutPantul_derajat ?? iAngle;
    const s = params.jarakBenda_cm ?? 20;

    if (query.includes("jelaskan") || query.includes("hasil") || query.includes("hukum")) {
      return `Hukum Pemantulan Cahaya menyatakan bahwa sudut datang (i) selalu sama dengan sudut pantul (r) diukur terhadap garis normal. 

Sudut datang laser adalah ${iAngle}°, sehingga sudut pantulnya adalah ${rAngle}°.`;
    }

    if (query.includes("bayangan") || query.includes("maya") || query.includes("jarak")) {
      return `Pada cermin datar, jarak bayangan di belakang cermin (s' = ${s} cm) selalu sama persis dengan jarak benda (s = ${s} cm). Bayangan ini bersifat maya, tegak, dan sama besar.`;
    }

    return `Eksperimen cermin datar: Sudut datang i = ${iAngle}° menghasilkan sudut pantul r = ${rAngle}°. Geser laser atau objek lilin untuk mengamati perubahannya!`;
  }

  return `Halo! Saya Asisten Laboratorium DILSA. Saya memantau parameter eksperimenmu secara langsung. Apa yang ingin kamu diskusikan tentang data ini?`;
}

export async function POST(req: NextRequest) {
  try {
    const body: AssistantRequest = await req.json();
    const { message, topic, parameters, measurements, activeStep } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();

    if (apiKey) {
      try {
        const systemPrompt = `Kamu adalah Asisten Laboratorium DILSA (Digital Laboratorium Science AI) untuk siswa SMP/MTs (kelas VII-IX).
Pedoman interaksi:
1. Bersahabat, mendidik, ringkas, bernada ilmiah tetapi mudah dipahami siswa SMP.
2. JANGAN PERNAH memakai emoji atau emotikon apa pun.
3. Gunakan pola sokratik: Pahami -> Arahkan -> Tanyakan prediksi -> Hubungkan rumus.
4. Gunakan nilai parameter dan data pengukuran resmi dari laboratorium.
5. JANGAN langsung membocorkan jawaban kuis jika siswa bertanya; berikan petunjuk konsepnya.
6. Berikan jawaban dalam Bahasa Indonesia yang bersih dan rapi.

Konteks Laboratorium Saat Ini:
- Topik: ${topic}
- Parameter aktif: ${JSON.stringify(parameters || {})}
- Hasil pengukuran saat ini: ${JSON.stringify(measurements || {})}
- Langkah eksperimen aktif: ${activeStep || 1}`;

        // Support multiple modern Gemini models in fallback order
        const modelCandidates = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];
        let apiSuccess = false;
        let generatedReply = "";

        for (const model of modelCandidates) {
          try {
            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
                    maxOutputTokens: 600
                  }
                })
              }
            );

            if (res.ok) {
              const data = await res.json();
              const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                // Strip emojis if any
                generatedReply = text.replace(
                  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
                  ""
                );
                apiSuccess = true;
                break;
              }
            } else {
              const errText = await res.text();
              console.warn(`Gemini API error with model ${model}:`, res.status, errText);
            }
          } catch (modelErr) {
            console.warn(`Failed model ${model}:`, modelErr);
          }
        }

        if (apiSuccess && generatedReply) {
          return NextResponse.json({ reply: generatedReply, source: "gemini_api" });
        }
      } catch (err) {
        console.warn("AI provider exception, falling back to heuristic engine", err);
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
