import { TopicData } from "@/types";

export const TOPICS: TopicData[] = [
  {
    id: "topic-1",
    slug: "gaya-dan-gerak",
    title: "Gaya dan Gerak: Pengaruh Gaya terhadap Gerak Benda",
    badge: "Fisika Mekanika",
    gradeLevel: "Kelas VII – VIII SMP/MTs",
    durationMinutes: 25,
    iconName: "Activity",
    summary:
      "Pelajari bagaimana gaya resultan mengubah kecepatan benda melalui Hukum II Newton, hubungan antara massa dan percepatan, serta pengaruh gaya gesekan pada lintasan.",
    learningObjectives: [
      "Menjelaskan hubungan antara gaya resultan (F), massa benda (m), dan percepatan (a).",
      "Membedakan antara sistem gaya seimbang (resultan nol) dan gaya tak seimbang.",
      "Mengamati pengaruh perubahan massa atau besar gaya terhadap kelajuan gerak benda.",
      "Menerapkan bentuk matematis Hukum II Newton: F = m × a dalam analisis data eksperimen.",
      "Mengidentifikasi pengaruh gaya gesekan terhadap perlambatan gerak benda."
    ],
    prerequisites: [
      "Konsep dasar jarak, perpindahan, kelajuan, dan kecepatan.",
      "Operasi perkalian dan pembagian dasar matematika.",
      "Satuan baku Sistem Internasional (meter, sekon, kilogram)."
    ],
    formalContent: {
      introduction:
        "Dalam kehidupan sehari-hari, kita sering mendorong belanjaan di supermarket atau menendang bola. Mengapa troli yang penuh barang terasa lebih berat untuk digerakkan daripada troli kosong? Fenomena ini dijelaskan oleh Isaac Newton dalam Hukum II Newton tentang gerak.",
      sections: [
        {
          title: "1. Pengertian Gaya dan Gerak",
          content: [
            "Gaya adalah tarikan atau dorongan yang diberikan pada suatu benda. Gaya merupakan besaran vektor, artinya memiliki besar (nilai numerik) dan arah tertentu.",
            "Gaya dapat menyebabkan benda diam menjadi bergerak, benda bergerak berubah kecepatannya (mempercepat atau memperlambat), atau mengubah arah gerak benda.",
            "Satuan standar internasional (SI) untuk gaya adalah Newton (disingkat N), dinamai dari fisikawan Sir Isaac Newton. Satu Newton setara dengan gaya yang diperlukan untuk mempercepat massa 1 kg sebesar 1 m/s²."
          ],
          keyPoints: [
            "Gaya adalah tarikan atau dorongan.",
            "Gaya memiliki nilai dan arah (besaran vektor).",
            "Satuan SI gaya adalah Newton (N)."
          ]
        },
        {
          title: "2. Hukum II Newton: Hubungan F, m, dan a",
          content: [
            "Hukum II Newton menyatakan: 'Percepatan yang dihasilkan oleh gaya resultan pada suatu benda berbanding lurus dengan besar gaya resultan tersebut, searah dengan gaya resultan, dan berbanding terbalik dengan massa benda.'",
            "Secara matematis, persamaan ini ditulis: F = m × a atau a = F / m.",
            "Jika gaya dorong diperbesar sementara massa benda tetap, maka percepatan benda akan semakin besar.",
            "Sebaliknya, jika massa benda bertambah sementara gaya dorong tetap sama, maka percepatan benda akan menjadi lebih kecil."
          ],
          keyPoints: [
            "Percepatan sebanding dengan gaya dorong total (F_net).",
            "Percepatan berbanding terbalik dengan massa (m).",
            "Rumus: F = m × a atau a = F / m."
          ]
        },
        {
          title: "3. Peran Gaya Gesekan (Friction)",
          content: [
            "Pada permukaan nyata, selalu ada gaya hambat yang timbul akibat kontak antarpermukaan, yang disebut gaya gesekan.",
            "Arah gaya gesekan selalu berlawanan dengan kecenderungan arah gerak benda.",
            "Gaya resultan (F_net) yang mempercepat benda adalah selisih antara gaya dorong (F_dorong) dan gaya gesekan (f_gesek): F_net = F_dorong - f_gesek.",
            "Jika lantai sangat licin (tanpa gesekan), maka seluruh gaya dorong menjadi gaya resultan murni."
          ],
          keyPoints: [
            "Gaya gesek selalu melawan arah gerak.",
            "F_net = F_dorong - f_gesek.",
            "Permukaan kasar memperbesar gesekan sehingga mengurangi percepatan."
          ]
        }
      ],
      formulas: [
        {
          name: "Hukum II Newton",
          formula: "F = m × a",
          description: "Gaya resultan sama dengan hasil kali massa dengan percepatan.",
          variables: [
            { symbol: "F", name: "Gaya Resultan", unit: "Newton (N)" },
            { symbol: "m", name: "Massa Benda", unit: "Kilogram (kg)" },
            { symbol: "a", name: "Percepatan", unit: "Meter per sekon kuadrat (m/s²)" }
          ]
        },
        {
          name: "Percepatan Benda",
          formula: "a = F_net / m",
          description: "Percepatan benda didapatkan dari gaya resultan dibagi massa.",
          variables: [
            { symbol: "a", name: "Percepatan", unit: "m/s²" },
            { symbol: "F_net", name: "Gaya Resultan", unit: "N" },
            { symbol: "m", name: "Massa", unit: "kg" }
          ]
        }
      ],
      realWorldApplications: [
        "Mendorong troli belanja: Troli penuh beras memerlukan gaya dorong lebih besar untuk mulai bergerak dibanding troli berisi keripik.",
        "Pengereman kendaraan: Mobil dengan muatan berat membutuhkan jarak rem yang lebih panjang karena inersia massanya lebih besar.",
        "Roket luar angkasa: Mengeluarkan gas pendorong berkekuatan jutaan Newton untuk mempercepat massa wahana antariksa."
      ],
      safetyAndAssumptions: [
        "Model laboratorium mengasumsikan lintasan horizontal satu dimensi yang lurus.",
        "Gaya gesek dimodelkan secara teratur berdasarkan koefisien gesek kinetik sederhana.",
        "Hasil simulasi bersifat deterministik berbasis kalkulasi fisika matematika murni."
      ]
    },
    labConfig: {
      goal: "Menguji kebenaran rumus F = m × a secara virtual dengan mengubah variabel gaya, massa, dan gesekan pada lintasan horizontal.",
      variables: {
        independent: "Gaya Dorong (N) dan Massa Benda (kg)",
        dependent: "Percepatan (m/s²) dan Kecepatan (m/s)",
        controlled: ["Kondisi permukaan lintasan (gesekan)", "Arah dorongan", "Posisi awal lintasan"]
      },
      suggestedExperiments: [
        {
          step: 1,
          title: "Pengaruh Besar Gaya pada Massa Tetap",
          instruction: "Tetapkan massa benda m = 2 kg. Coba berikan gaya F = 10 N, lalu 20 N, lalu 30 N dengan gesekan nol. Amati nilai percepatan a.",
          expectedObservation: "Percepatan meningkat secara linier (5 m/s², 10 m/s², 15 m/s²)."
        },
        {
          step: 2,
          title: "Pengaruh Massa pada Gaya Tetap",
          instruction: "Tetapkan gaya dorong F = 20 N. Variasikan massa benda dari 2 kg, 4 kg, hingga 10 kg. Amati perubahan nilai a.",
          expectedObservation: "Semakin besar massa, percepatan benda semakin kecil (10 m/s², 5 m/s², 2 m/s²)."
        },
        {
          step: 3,
          title: "Uji Pengaruh Permukaan Bergesekan",
          instruction: "Pilih gaya 20 N dan massa 4 kg. Bandingkan percepatan pada kondisi 'Tanpa Gesekan', 'Gesekan Rendah', dan 'Gesekan Kasar'.",
          expectedObservation: "Gaya gesek mengurangi gaya dorong efektif, sehingga percepatan neto benda menurun."
        }
      ]
    },
    quiz: [
      {
        id: "q1-1",
        question: "Jika sebuah balok bermassa 4 kg didorong dengan gaya resultan 20 N di atas lantai licin tanpa gesekan, berapakah percepatan balok tersebut?",
        options: ["2 m/s²", "5 m/s²", "16 m/s²", "80 m/s²"],
        correctAnswerIndex: 1,
        explanation: "Berdasarkan Hukum II Newton: a = F / m = 20 N / 4 kg = 5 m/s².",
        conceptTag: "Perhitungan Hukum II Newton"
      },
      {
        id: "q1-2",
        question: "Sebuah benda bergerak dengan percepatan tertentu. Jika gaya dorong dilipatgandakan menjadi dua kali semula sedangkan massa benda dipertahankan tetap, apa yang terjadi pada percepatan benda?",
        options: [
          "Percepatan berkurang menjadi setengahnya",
          "Percepatan tetap tidak berubah",
          "Percepatan menjadi dua kali lipat lebih besar",
          "Percepatan menjadi empat kali lipat lebih besar"
        ],
        correctAnswerIndex: 2,
        explanation: "Karena percepatan sebanding lurus dengan gaya (a ~ F), jika gaya dikalikan 2 pada massa tetap, maka percepatan juga meningkat menjadi 2 kali lipat.",
        conceptTag: "Hubungan Gaya dan Percepatan"
      },
      {
        id: "q1-3",
        question: "Dua balok didorong dengan gaya dorong yang sama besar (30 N). Balok A memiliki massa 2 kg, sedangkan Balok B memiliki massa 6 kg. Pernyataan manakah yang benar?",
        options: [
          "Balok A memiliki percepatan 3 kali lebih besar daripada Balok B",
          "Balok B memiliki percepatan 3 kali lebih besar daripada Balok A",
          "Kedua balok memiliki percepatan yang sama karena gayanya sama",
          "Balok B tidak akan mengalami percepatan sama sekali"
        ],
        correctAnswerIndex: 0,
        explanation: "a_A = 30 / 2 = 15 m/s², sedangkan a_B = 30 / 6 = 5 m/s². Balok A memiliki percepatan 3 kali lipat Balok B karena massanya 3 kali lebih ringan (berbanding terbalik).",
        conceptTag: "Pengaruh Massa terhadap Gerak"
      },
      {
        id: "q1-4",
        question: "Sebuah balok didorong ke kanan dengan gaya 25 N, namun lantai kasar memberikan gaya gesekan sebesar 5 N ke arah kiri. Berapakah gaya resultan (F_net) yang bekerja pada balok?",
        options: ["30 N ke arah kanan", "25 N ke arah kanan", "20 N ke arah kanan", "5 N ke arah kiri"],
        correctAnswerIndex: 2,
        explanation: "Gaya resultan adalah penjumlahan vektor: F_net = F_dorong - f_gesek = 25 N - 5 N = 20 N ke arah kanan.",
        conceptTag: "Gaya Gesekan dan Resultan"
      },
      {
        id: "q1-5",
        question: "Pada grafik kecepatan terhadap waktu (v-t), kemiringan (gradien) garis menunjukkan besaran fisika apa?",
        options: ["Jarak tempuh", "Percepatan benda", "Massa benda", "Gaya gesekan"],
        correctAnswerIndex: 1,
        explanation: "Gradien pada grafik v-t adalah perubahan kecepatan dibagi perubahan waktu (Δv / Δt), yang merupakan definisi dari percepatan.",
        conceptTag: "Interpretasi Grafik Kinematika"
      },
      {
        id: "q1-6",
        question: "Mengapa sebuah mobil truk bermuatan penuh memerlukan jarak pengereman yang lebih panjang dibandingkan mobil sedan kecil saat melaju pada kecepatan yang sama?",
        options: [
          "Truk memiliki massa jauh lebih besar sehingga kelembaman (inersianya) lebih besar",
          "Truk tidak memiliki gaya gesek dengan aspal jalan",
          "Gaya gravitasi tidak bekerja pada mobil sedan",
          "Percepatan truk selalu bernilai positif meskipun sedang direm"
        ],
        correctAnswerIndex: 0,
        explanation: "Semakin besar massa suatu benda, semakin besar kelembaman (inersianya) untuk mempertahankan keadaan geraknya, sehingga diperlukan gaya henti lebih besar atau waktu henti lebih lama.",
        conceptTag: "Aplikasi Nyata Hukum Newton"
      }
    ]
  },
  {
    id: "topic-2",
    slug: "kelistrikan",
    title: "Kelistrikan: Rangkaian Listrik Sederhana",
    badge: "Fisika Kelistrikan",
    gradeLevel: "Kelas VIII – IX SMP/MTs",
    durationMinutes: 30,
    iconName: "Zap",
    summary:
      "Pelajari prinsip aliran arus listrik searah (DC), Hukum Ohm (V = I × R), perbedaan rangkaian seri dan paralel, serta faktor yang menentukan nyala terang lampu.",
    learningObjectives: [
      "Mengidentifikasi fungsi komponen utama: sumber tegangan (baterai), kabel penghantar, sakelar, dan beban (lampu/resistor).",
      "Membedakan kondisi rangkaian terbuka (arus nol) dan rangkaian tertutup.",
      "Menganalisis hubungan matematis Hukum Ohm antara tegangan (V), arus (I), dan hambatan (R).",
      "Membandingkan karakteristik kuat arus, tegangan, dan terang lampu pada rangkaian seri vs paralel.",
      "Memahami konsep dasar keselamatan dalam penggunaan rangkaian listrik."
    ],
    prerequisites: [
      "Konsep muatan listrik positif dan negatif.",
      "Pengenalan konduktor dan isolator.",
      "Pecahan dan operasi aljabar dasar untuk menghitung hambatan pengganti."
    ],
    formalContent: {
      introduction:
        "Lampu di rumah kita bisa menyala ketika sakelar dinyalakan. Namun mengapa ketika satu lampu di kamar padam, lampu di ruang tamu tetap menyala? Hal ini terkait erat dengan jenis rangkaian listrik yang digunakan: rangkaian seri atau rangkaian paralel.",
      sections: [
        {
          title: "1. Komponen Rangkaian dan Rangkaian Tertutup",
          content: [
            "Sebuah rangkaian listrik membutuhkan sumber energi (seperti baterai yang menyediakan beda potensial atau tegangan), jalur penghantar (kabel tembaga), pemutus arus (sakelar), dan perangkat pemakai energi (beban, seperti lampu atau resistor).",
            "Arus listrik hanya dapat mengalir jika rangkaian membentuk jalur melingkar yang utuh tanpa celah terputus, yang disebut rangkaian tertutup.",
            "Jika sakelar dibuka atau ada kabel yang terputus, muatan listrik tidak dapat bersirkulasi sehingga arus bernilai 0 Ampere (rangkaian terbuka)."
          ],
          keyPoints: [
            "Rangkaian tertutup memungkinkan arus mengalir.",
            "Rangkaian terbuka menghentikan aliran arus (I = 0).",
            "Arah konvensional arus: kutub positif menuju kutub negatif."
          ]
        },
        {
          title: "2. Hukum Ohm: V = I × R",
          content: [
            "Georg Simon Ohm merumuskan bahwa kuat arus listrik (I) yang mengalir melalui sebuah penghantar sebanding dengan beda potensial atau tegangan (V) di kedua ujungnya, dan berbanding terbalik dengan hambatan (R) penghantar tersebut.",
            "Rumus Hukum Ohm: V = I × R, atau I = V / R, atau R = V / I.",
            "Tegangan diukur dalam satuan Volt (V), kuat arus dalam Ampere (A), dan hambatan dalam Ohm (Ω).",
            "Jika tegangan baterai dinaikkan pada hambatan tetap, arus akan meningkat. Jika hambatan diperbesar pada tegangan tetap, arus akan menurun."
          ],
          keyPoints: [
            "Hukum Ohm: V = I × R.",
            "Makin besar tegangan, makin besar arus listrik.",
            "Makin besar hambatan, makin kecil arus yang lewat."
          ]
        },
        {
          title: "3. Rangkaian Seri vs Rangkaian Paralel",
          content: [
            "Rangkaian Seri: Komponen dipasang berurutan pada satu jalur tunggal. Kuat arus yang melewati setiap lampu sama besar (I_total = I_1 = I_2). Hambatan total bertambah (R_total = R_1 + R_2). Jika satu lampu dilepas, seluruh rangkaian terputus dan semua lampu mati.",
            "Rangkaian Paralel: Komponen dipasang bersusun bercabang. Tegangan pada setiap cabang sama besar dengan tegangan sumber (V_total = V_1 = V_2). Hambatan total lebih kecil dari hambatan terkecil (1/R_total = 1/R_1 + 1/R_2). Jika satu lampu padam, cabang lampu lainnya tetap menyala.",
            "Daya listrik yang diserap lampu menentukan terangnya nyala lampu: P = V × I = I² × R. Pada paralel, lampu menyala lebih terang dibanding seri karena masing-masing mendapat tegangan penuh dari baterai."
          ],
          keyPoints: [
            "Seri: Jalur tunggal, arus sama, jika satu mati semua mati.",
            "Paralel: Jalur bercabang, tegangan sama, lampu lebih terang dan independen.",
            "Instalasi rumah tangga menggunakan rangkaian paralel."
          ]
        }
      ],
      formulas: [
        {
          name: "Hukum Ohm",
          formula: "V = I × R",
          description: "Tegangan listrik sama dengan kuat arus dikalikan hambatan.",
          variables: [
            { symbol: "V", name: "Tegangan / Beda Potensial", unit: "Volt (V)" },
            { symbol: "I", name: "Kuat Arus Listrik", unit: "Ampere (A)" },
            { symbol: "R", name: "Hambatan Listrik", unit: "Ohm (Ω)" }
          ]
        },
        {
          name: "Hambatan Pengganti Seri",
          formula: "R_total = R_1 + R_2",
          description: "Hambatan total pada rangkaian seri merupakan penjumlahan langsung.",
          variables: [
            { symbol: "R_total", name: "Hambatan Pengganti", unit: "Ohm (Ω)" },
            { symbol: "R_1, R_2", name: "Hambatan Masing-masing", unit: "Ohm (Ω)" }
          ]
        },
        {
          name: "Hambatan Pengganti Paralel",
          formula: "1/R_total = 1/R_1 + 1/R_2",
          description: "Kebalikan hambatan total paralel adalah jumlah kebalikan masing-masing hambatan.",
          variables: [
            { symbol: "R_total", name: "Hambatan Pengganti Paralel", unit: "Ohm (Ω)" }
          ]
        }
      ],
      realWorldApplications: [
        "Instalasi listrik rumah tangga menggunakan rangkaian paralel agar mematikan lampu kamar mandi tidak mematikan kulkas di dapur.",
        "Lampu hias pohon natal tradisional sering menggunakan susunan seri, di mana putusnya satu bohlam membuat seluruh deret padam.",
        "Sekring dan MCB dipasang secara seri dengan kabel utama untuk memutus arus ketika terjadi beban berlebih demi mencegah kebakaran."
      ],
      safetyAndAssumptions: [
        "Simulasi virtual menggunakan model DC (arus searah) deterministik ideal.",
        "Nyala lampu dimodelkan secara visual proporsional terhadap daya listrik terdisipasi.",
        "PERINGATAN: Di dunia nyata, jangan pernah menghubungkan kutub baterai secara langsung tanpa beban karena dapat menyebabkan korsleting (short circuit) dan baterai panas/terbakar."
      ]
    },
    labConfig: {
      goal: "Menguji Hukum Ohm dan membandingkan karakteristik arus, tegangan, serta kecerahan lampu pada konfigurasi seri dan paralel.",
      variables: {
        independent: "Tegangan Baterai (V), Nilai Hambatan (Ω), dan Topologi Rangkaian (Seri/Paralel)",
        dependent: "Kuat Arus (A) dan Daya / Terang Lampu (Watt)",
        controlled: ["Kondisi sakelar", "Karakteristik penghantar ideal (resistansi kabel = 0)"]
      },
      suggestedExperiments: [
        {
          step: 1,
          title: "Uji Sakelar Terbuka vs Tertutup",
          instruction: "Buat rangkaian sederhana 1 baterai dan 1 lampu. Buka dan tutup sakelar. Amati penunjuk ammeter dan nyala lampu.",
          expectedObservation: "Saat sakelar terbuka arus bernilai 0 A dan lampu mati. Saat sakelar ditutup arus mengalir dan lampu menyala."
        },
        {
          step: 2,
          title: "Uji Hukum Ohm (Tegangan vs Kuat Arus)",
          instruction: "Gunakan 1 lampu dengan hambatan 10 Ω. Naikkan tegangan baterai dari 3V, 6V, 9V, hingga 12V. Amati nilai kuat arus I.",
          expectedObservation: "Arus listrik bertambah secara linier sesuai I = V / R (0.3 A, 0.6 A, 0.9 A, 1.2 A) dan nyala lampu makin benderang."
        },
        {
          step: 3,
          title: "Perbandingan Rangkaian Seri dan Rangkaian Paralel",
          instruction: "Bandingkan 2 lampu identik (masing-masing 10 Ω) pada tegangan 12 V: susun secara seri, lalu ubah ke susunan paralel.",
          expectedObservation: "Pada rangkaian seri, hambatan total menjadi 20 Ω (arus 0.6 A, lampu redup). Pada paralel, hambatan total menjadi 5 Ω (arus cabang masing-masing 1.2 A, lampu sangat terang)."
        }
      ]
    },
    quiz: [
      {
        id: "q2-1",
        question: "Sebuah lampu memiliki hambatan 20 Ω dihubungkan dengan sumber tegangan 10 Volt pada rangkaian tertutup. Berapakah kuat arus yang mengalir?",
        options: ["0.5 Ampere", "2.0 Ampere", "10 Ampere", "200 Ampere"],
        correctAnswerIndex: 0,
        explanation: "Berdasarkan Hukum Ohm: I = V / R = 10 V / 20 Ω = 0.5 A.",
        conceptTag: "Perhitungan Hukum Ohm"
      },
      {
        id: "q2-2",
        question: "Dua buah lampu masing-masing berhambatan 6 Ω dirangkai secara seri dengan baterai 12 Volt. Berapakah hambatan total dan kuat arus rangkaian?",
        options: [
          "Hambatan total 3 Ω dan arus 4 A",
          "Hambatan total 12 Ω dan arus 1 A",
          "Hambatan total 12 Ω dan arus 2 A",
          "Hambatan total 36 Ω dan arus 0.33 A"
        ],
        correctAnswerIndex: 1,
        explanation: "R_total = R_1 + R_2 = 6 + 6 = 12 Ω. Kuat arus I = V / R_total = 12 V / 12 Ω = 1 A.",
        conceptTag: "Rangkaian Seri"
      },
      {
        id: "q2-3",
        question: "Dua buah lampu berhambatan 10 Ω dihubungkan secara paralel ke baterai 10 Volt. Pernyataan berikut yang paling tepat adalah...",
        options: [
          "Kedua lampu menerima tegangan yang sama besar yaitu 10 Volt",
          "Arus total rangkaian lebih kecil dibanding jika dirangkai seri",
          "Jika salah satu lampu dilepas, lampu yang lain ikut padam",
          "Hambatan total rangkaian bertambah menjadi 20 Ω"
        ],
        correctAnswerIndex: 0,
        explanation: "Pada rangkaian paralel, tegangan pada setiap cabang sama besar dengan tegangan sumber (10 V). Hambatan total justru mengecil (5 Ω) sehingga arus lebih besar.",
        conceptTag: "Karakteristik Rangkaian Paralel"
      },
      {
        id: "q2-4",
        question: "Apa yang menyebabkan sakelar dapat mematikan lampu dalam suatu rangkaian listrik?",
        options: [
          "Sakelar membalikkan kutub positif dan negatif baterai",
          "Sakelar membuka rangkaian sehingga memutus jalur aliran muatan listrik",
          "Sakelar menyerap semua muatan listrik yang ada pada kabel",
          "Sakelar mengubah arus searah menjadi arus bolak-balik"
        ],
        correctAnswerIndex: 1,
        explanation: "Membuka sakelar menciptakan celah isolator udara, mengubah rangkaian tertutup menjadi rangkaian terbuka sehingga arus listrik berhenti mengalir (I = 0).",
        conceptTag: "Fungsi Sakelar"
      },
      {
        id: "q2-5",
        question: "Jika nilai tegangan baterai dinaikkan sedangkan nilai hambatan resistor dipertahankan konstan, bagaimana perubahan kuat arus yang terukur pada ammeter?",
        options: [
          "Kuat arus akan menurun",
          "Kuat arus akan meningkat secara proporsional",
          "Kuat arus tetap konstan",
          "Kuat arus langsung menjadi nol"
        ],
        correctAnswerIndex: 1,
        explanation: "Menurut Hukum Ohm (I = V / R), kuat arus berbanding lurus dengan beda potensial tegangan selama nilai hambatan konstan.",
        conceptTag: "Hubungan V dan I"
      },
      {
        id: "q2-6",
        question: "Mengapa instalasi listrik di rumah-rumah disusun secara paralel dan bukan secara seri?",
        options: [
          "Agar membutuhkan kabel tembaga yang lebih sedikit",
          "Agar setiap alat listrik memperoleh tegangan kerja standar yang sama dan dapat dinyalakan/dimatikan secara terpisah",
          "Agar jika satu alat rusak seluruh rumah sengaja padam untuk alasan penghematan",
          "Karena rangkaian paralel menghasilkan tegangan yang berbeda-beda di setiap ruangan"
        ],
        correctAnswerIndex: 1,
        explanation: "Rangkaian paralel memberikan tegangan seragam (misal 220V) ke setiap alat, dan memastikan peralatan dapat beroperasi secara mandiri tanpa saling mematikan.",
        conceptTag: "Aplikasi Kelistrikan Praktis"
      }
    ]
  },
  {
    id: "topic-3",
    slug: "cahaya-dan-optik",
    title: "Cahaya dan Optik: Pemantulan pada Cermin Datar",
    badge: "Fisika Optika",
    gradeLevel: "Kelas VIII SMP/MTs",
    durationMinutes: 25,
    iconName: "Sun",
    summary:
      "Pelajari Hukum Pemantulan Cahaya (sudut datang = sudut pantul), fungsi garis normal, serta pembentukan dan sifat-sifat bayangan maya pada cermin datar.",
    learningObjectives: [
      "Menjelaskan konsep pemantulan teratur (spekuler) pada permukaan cermin datar.",
      "Mengidentifikasi garis normal, berkas sinar datang, dan berkas sinar pantul.",
      "Membuktikan Hukum Pemantulan Cahaya: sudut datang (i) sama dengan sudut pantul (r).",
      "Menganalisis sifat-sifat bayangan pada cermin datar (maya, tegak, sama besar, jarak bayangan sama dengan jarak benda).",
      "Menggunakan alat ukur sudut (busur derajat virtual) untuk memprediksi arah rambat berkas sinar pantul."
    ],
    prerequisites: [
      "Konsep bahwa cahaya merambat lurus dalam medium homogen.",
      "Pengukuran sudut dalam satuan derajat (°).",
      "Garis tegak lurus (perpendicular) dan bidang geometri 2D."
    ],
    formalContent: {
      introduction:
        "Setiap pagi ketika bersiap ke sekolah, kita bercermin untuk merapikan pakaian. Bayangan kita tampak jelas di balik cermin pada jarak yang seolah-olah sama dengan posisi kita berdiri. Bagaimana proses optik terbentuknya bayangan tersebut?",
      sections: [
        {
          title: "1. Hakikat Cahaya dan Pemantulan Teratur",
          content: [
            "Cahaya merupakan gelombang elektromagnetik yang merambat lurus dalam medium seragam. Arah rambatan cahaya digambarkan menggunakan garis berpanah yang disebut berkas sinar.",
            "Ketika berkas cahaya mengenai permukaan licin dan mengkilap seperti cermin datar, seluruh berkas sinar dipantulkan secara teratur ke arah yang teratur (pemantulan teratur atau spekuler).",
            "Permukaan kasar sebaliknya menyebabkan pemantulan baur (difus), sehingga tidak menghasilkan bayangan cermin yang jelas."
          ],
          keyPoints: [
            "Cahaya merambat lurus.",
            "Cermin datar menghasilkan pemantulan teratur.",
            "Permukaan licin memantulkan berkas cahaya secara teratur."
          ]
        },
        {
          title: "2. Hukum Pemantulan Cahaya (Hukum Snellius Pemantulan)",
          content: [
            "Garis Normal adalah garis khayal yang ditarik tegak lurus (membentuk sudut 90°) terhadap permukaan cermin pada titik jatuhnya sinar.",
            "Sudut Datang (i) adalah sudut antara sinar datang dengan garis normal (BUKAN sudut dengan permukaan cermin).",
            "Sudut Pantul (r) adalah sudut antara sinar pantul dengan garis normal.",
            "Hukum Pemantulan menyatakan: 1. Sinar datang, sinar pantul, dan garis normal berada pada satu bidang datar. 2. Sudut datang sama dengan sudut pantul: sudut i = sudut r."
          ],
          keyPoints: [
            "Garis normal selalu tegak lurus (90°) terhadap cermin.",
            "Sudut selalu diukur terhadap garis normal.",
            "Hukum Pemantulan: sudut i = sudut r."
          ]
        },
        {
          title: "3. Sifat Bayangan pada Cermin Datar",
          content: [
            "Bayangan pada cermin datar terbentuk dari perpotongan perpanjangan sinar-sinar pantul di belakang cermin, sehingga disebut bayangan maya (virtual). Bayangan ini tidak dapat ditangkap oleh layar fisik.",
            "Sifat-sifat bayangan pada cermin datar:",
            "- Maya (seolah-olah berada di belakang cermin).",
            "- Tegak (arah atas benda tetap di atas bayangan).",
            "- Sama besar (tinggi benda h = tinggi bayangan h').",
            "- Jarak bayangan ke cermin sama dengan jarak benda ke cermin (s = s').",
            "- Mengalami pembalikan sisi kiri dan kanan (perikiri/lateral inversion)."
          ],
          keyPoints: [
            "Sifat bayangan: Maya, Tegak, Sama besar (Perbesaran M = 1).",
            "Jarak benda ke cermin = Jarak bayangan ke cermin (s = s').",
            "Mengalami pembalikan lateral (kiri jadi kanan)."
          ]
        }
      ],
      formulas: [
        {
          name: "Hukum Pemantulan",
          formula: "sudut i = sudut r",
          description: "Sudut datang sinar sama besar dengan sudut pantul sinar terhadap garis normal.",
          variables: [
            { symbol: "i", name: "Sudut Datang", unit: "Derajat (°)" },
            { symbol: "r", name: "Sudut Pantul", unit: "Derajat (°)" }
          ]
        },
        {
          name: "Jarak dan Perbesaran Cermin Datar",
          formula: "s' = s dan M = h' / h = 1",
          description: "Jarak bayangan sama dengan jarak benda, dan ukuran bayangan sama dengan ukuran benda.",
          variables: [
            { symbol: "s", name: "Jarak Benda", unit: "Centimeter (cm)" },
            { symbol: "s'", name: "Jarak Bayangan", unit: "Centimeter (cm)" },
            { symbol: "M", name: "Perbesaran Bayangan", unit: "Tanpa Satuan" }
          ]
        }
      ],
      realWorldApplications: [
        "Periskop kapal selam: Menggunakan dua cermin datar dengan posisi kemiringan 45° untuk melihat objek di atas permukaan air laut.",
        "Kaca spion kabin mobil: Memungkinkan pengemudi melihat lalu lintas di belakang dengan ukuran dan jarak proporsional.",
        "Ilusi optik panggung dan labirin cermin: Memanfaatkan pemantulan ganda untuk menciptakan ruangan yang tampak luas tak terbatas."
      ],
      safetyAndAssumptions: [
        "Simulasi virtual mengasumsikan cermin datar tipis ideal tanpa ketebalan kaca penyerap cahaya.",
        "Sinar diperlakukan dalam optika geometri sinar sempit (ray optics).",
        "Bayangan maya digambarkan melalui perpanjangan garis putus-putus geometris di balik cermin."
      ]
    },
    labConfig: {
      goal: "Menguji Hukum Pemantulan sudut datang = sudut pantul dan mengamati posisi bayangan maya pada cermin datar.",
      variables: {
        independent: "Sudut Datang Sinar (i) dan Posisi Benda (cm)",
        dependent: "Sudut Pantul Sinar (r) dan Posisi Bayangan Maya (cm)",
        controlled: ["Orientasi cermin datar", "Medium udara (indeks bias seragam)"]
      },
      suggestedExperiments: [
        {
          step: 1,
          title: "Uji Kesamaan Sudut Datang dan Pantul",
          instruction: "Ubah sudut datang sinar laser ke 30°, lalu 45°, lalu 60°. Aktifkan busur derajat dan amati sudut pantul yang terbentuk.",
          expectedObservation: "Sudut pantul yang terukur selalu sama persis dengan sudut datang terhadap garis normal (30°, 45°, 60°)."
        },
        {
          step: 2,
          title: "Sinar Tegak Lurus (Normal Incidence)",
          instruction: "Arahkan sudut datang tepat berhimpit dengan garis normal (sudut datang i = 0°).",
          expectedObservation: "Sinar dipantulkan kembali tepat pada lintasannya sendiri (sudut pantul r = 0°)."
        },
        {
          step: 3,
          title: "Hubungan Jarak Benda dan Bayangan Maya",
          instruction: "Pindahkan objek lilin mendekat dan menjauh dari permukaan cermin (misal dari 10 cm ke 20 cm).",
          expectedObservation: "Posisi bayangan maya di belakang cermin otomatis bergeser sehingga jaraknya selalu sama persis dengan jarak benda (s' = s)."
        }
      ]
    },
    quiz: [
      {
        id: "q3-1",
        question: "Sebuah berkas sinar cahaya jatuh pada cermin datar dengan sudut datang 35° terhadap garis normal. Berapakah besar sudut pantulnya?",
        options: ["35°", "55°", "70°", "90°"],
        correctAnswerIndex: 0,
        explanation: "Berdasarkan Hukum Pemantulan Cahaya, sudut pantul (r) selalu sama dengan sudut datang (i) jika diukur terhadap garis normal: r = i = 35°.",
        conceptTag: "Hukum Pemantulan Sudut"
      },
      {
        id: "q3-2",
        question: "Jika berkas sinar datang membentuk sudut 40° terhadap permukaan cermin datar, berapakah besar sudut pantul terhadap garis normal?",
        options: ["40°", "50°", "80°", "90°"],
        correctAnswerIndex: 1,
        explanation: "Garis normal tegak lurus (90°) dengan permukaan cermin. Jika sudut dengan permukaan adalah 40°, maka sudut datang terhadap garis normal i = 90° - 40° = 50°. Maka sudut pantul r = 50°.",
        conceptTag: "Penentuan Sudut terhadap Garis Normal"
      },
      {
        id: "q3-3",
        question: "Seseorang berdiri tepat 1,5 meter di depan sebuah cermin datar besar. Berapakah jarak antara orang tersebut dengan bayangan dirinya di dalam cermin?",
        options: ["0,75 meter", "1,5 meter", "3,0 meter", "4,5 meter"],
        correctAnswerIndex: 2,
        explanation: "Jarak bayangan ke cermin sama dengan jarak orang ke cermin (1,5 meter). Maka jarak total orang ke bayangannya adalah 1,5 m + 1,5 m = 3,0 meter.",
        conceptTag: "Jarak Bayangan Cermin Datar"
      },
      {
        id: "q3-4",
        question: "Manakah kombinasi sifat bayangan yang paling tepat untuk benda yang berada di depan cermin datar?",
        options: [
          "Nyata, terbalik, diperkecil",
          "Maya, tegak, sama besar",
          "Maya, tegak, diperbesar",
          "Nyata, tegak, sama besar"
        ],
        correctAnswerIndex: 1,
        explanation: "Bayangan pada cermin datar selalu bersifat maya (berada di belakang cermin), tegak (orientasi atas-bawah sama), dan sama besar (perbesaran M = 1).",
        conceptTag: "Sifat Bayangan Cermin Datar"
      },
      {
        id: "q3-5",
        question: "Apa arti garis putus-putus di belakang cermin yang ditarik saat menggambar diagram pembentukan bayangan optik?",
        options: [
          "Sinar nyata yang menembus kaca cermin",
          "Perpanjangan garis sinar pantul untuk mengonstruksi titik bayangan maya",
          "Sinar inframerah yang kasat mata",
          "Jalur kabel daya listrik cermin"
        ],
        correctAnswerIndex: 1,
        explanation: "Garis putus-putus menunjukkan perpanjangan maya sinar pantul ke belakang cermin, karena sinar cahaya sesungguhnya tidak menembus cermin datar melainkan dipantulkan.",
        conceptTag: "Diagram Konstruksi Sinar"
      },
      {
        id: "q3-6",
        question: "Ketika kamu mengangkat tangan kananmu di depan cermin datar, tangan manakah yang tampak terangkat pada bayangan di cermin?",
        options: [
          "Tangan kanan bayangan",
          "Tangan kiri bayangan (pembalikan lateral)",
          "Kedua tangan bayangan terangkat bersamaan",
          "Bayangan tidak menirukan gerakan tangan"
        ],
        correctAnswerIndex: 1,
        explanation: "Cermin datar menghasilkan pembalikan sisi kiri dan kanan (pembalikan lateral), sehingga saat kita mengangkat tangan kanan, bayangan tampak mengangkat tangan kirinya.",
        conceptTag: "Pembalikan Lateral"
      }
    ]
  }
];

export function getTopicBySlug(slug: string): TopicData | undefined {
  return TOPICS.find((t) => t.slug === slug);
}
