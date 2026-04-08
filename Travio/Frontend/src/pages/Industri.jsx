import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Industri() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="w-full relative overflow-x-hidden bg-[#060606]">
      {/* Hero Section */}
      <section className="relative w-full h-[620px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/bahan/city.webp')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-6xl sm:text-8xl md:text-8xl font-extrabold mb-4" data-aos="fade-up">
            HI Business People
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-bold tracking-wide" data-aos="fade-up" data-aos-delay="100">
            ERA BARU OTOMATISASI PEKERJAAN DENGAN AI SUDAH TERSEDIA
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="w-full bg-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-black font-bold text-left mb-6" data-aos="fade-up">
            OTOMATISKAN SEMUA PEKERJAAN PEMANTAUAN DAN ANALISIS DATA PADA BISNIS
            ANDA, BUKTIKAN BAHWA{" "}
            <span className="text-[#A8DF34]">
              BISNIS ANDA TUMBUH DENGAN VISION AI
            </span>
          </h2>
          <p className="text-gray-700 text-left mb-12 max-w-6xl leading-relaxed">
            Kecerdasan buatan (AI) bukanlah ancaman bagi pekerjaan manusia,
            melainkan alat yang menyempurnakan cara kita bekerja. AI membantu
            manusia berpikir lebih strategis, bekerja lebih efisien, dan
            mengambil keputusan berbasis data dengan lebih cepat. Jika tugas
            rutin dapat diotomatisasi oleh AI, manusia justru dapat lebih fokus
            pada hal-hal yang memerlukan empati, kreativitas, dan pemikiran
            kritis. Dengan kata lain, AI bukan untuk menggantikan tangan dan
            pikiran manusia, tapi untuk memperluas jangkauan potensi manusia itu
            sendiri. Masa depan kerja bukan tentang manusia vs. mesin, melainkan
            kolaborasi antara keduanya demi hasil yang lebih cerdas, cepat, dan
            bermakna.
          </p>

          <div className="w-full flex justify-center" data-aos="zoom-in">
            <img
              src="/bahan/Ai.png"
              alt="Vision AI"
              className="w-full max-w-5xl h-auto drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Industry Section Title */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-black py-10" data-aos="fade-up">
            VISION AI RELEVAN UNTUK INDUSTRI ANDA
          </h2>
        </div>
      </section>

      {/* Industry 1 */}
      <section className="w-full bg-[#A8DF34] py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* IMAGE – tampil dulu di mobile */}
          <div className="flex justify-center order-1 md:order-2" data-aos="fade-left">
            <img
              src="/bahan/generated.webp"
              alt="Retail & Shopping Mall"
              className="w-full max-w-md rounded-xl shadow-xl"
            />
          </div>

          {/* TEXT – tampil setelah image di mobile */}
          <div className="order-2 md:order-1" data-aos="fade-right">
            <h3 className="text-xl sm:text-2xl text-black font-extrabold mb-4">
              1. RETAIL & SHOPPING MALL
            </h3>
            <p className="text-black/80 leading-relaxed mb-6">
              Vision AI dipakai untuk people counting, heatmap pergerakan
              pengunjung, analisis jalur kunjungan, sampai segmentasi demografis
              dasar dari CCTV yang sudah ada. Insight ini membantu optimasi
              layout toko/mall, penempatan display, pengelolaan antrian, dan
              pengambilan keputusan sewa atau tarif area premium berbasis data
              perilaku nyata di lapangan.
            </p>
            <button className="bg-black border text-white px-4 py-2 rounded-md font-semibold shadow-md">
              Request proposal
            </button>
          </div>
        </div>
      </section>

      {/* Industry 2 */}
      <section className="w-full bg-[#0E0E0E] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center md:justify-start order-1 md:order-1" data-aos="fade-right">
            <img
              src="/bahan/own.webp"
              alt="Manufacturing"
              className="w-full max-w-md rounded-xl shadow-xl"
            />
          </div>
          <div className="order-2 md:order-2" data-aos="fade-left">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4">
              2. MANUFACTURING
            </h3>
            <p className="text-white/80 leading-relaxed mb-6">
              Di pabrik, Vision AI digunakan untuk quality control visual serta
              pemantauan kepatuhan APD (helm, rompi, kacamata, sarung tangan)
              secara real time melalui kamera. Sistem dapat mendeteksi pekerja
              yang memasuki area berisiko tanpa APD, mengirim alert, dan merekam
              data untuk audit K3, sehingga kecelakaan kerja berkurang dan
              efisiensi operasional meningkat
            </p>
            <button className="border border-white text-white px-4 py-2 rounded-md font-semibold shadow-md">
              Request proposal
            </button>
          </div>
        </div>
      </section>

      {/* Industry 3 */}
      <section className="w-full bg-[#0E0E0E] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1" data-aos="fade-right">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4">
              3. ADVERTISING & MEDIA
            </h3>
            <p className="text-white/80 leading-relaxed mb-6">
              Vision AI memungkinkan pengukuran jumlah kendaraan atau pejalan
              kaki, estimasi impresi, hingga atensi terhadap billboard/screen
              OOH, bukan lagi sekadar estimasi statis. Data ini dipakai untuk
              membuktikan performa kampanye, mengoptimasi lokasi dan jam tayang,
              serta mengubah OOH dari channel awareness pasif menjadi media yang
              terukur layaknya digital ads.
            </p>
            <a
              href="/Proposal Media Billboard 2026.pdf"
              download
              className="inline-block border border-white text-white px-4 py-2 rounded-md font-semibold shadow-md"
            >
              Request proposal
            </a>
          </div>
          <div className="flex justify-center order-1 md:order-2" data-aos="fade-left">
            <img
              src="/bahan/chatgpt.webp"
              alt="Advertising & Media"
              className="w-full max-w-md rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center py-20">
          <h2 className="text-lg sm:text-xl md:text-2xl text-black font-bold mb-6 leading-tight" data-aos="fade-up">
            TRAVIO AKAN SELALU MEMBERIKAN LAYANAN SEWA MEDIA IKLAN TERBAIK TERMASUK TRANSPARANSI INFORMASI 
          </h2>
          <p className="text-gray-600 mb-8">
            Lebih dari 100+ titik di Banten | Sewa Billboard | Jasa Bikin Website | Jasa Optimisasi Google Bisnis | Dashboard Informatif
          </p>
          <button className="bg-[#A8DF34] text-black px-5 py-2 rounded-lg font-bold text-sm sm:text-base shadow-xl">
            HUBUNGI KAMI SEKARANG
          </button>
        </div>
      </section>
    </div>
  );
}
