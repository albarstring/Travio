import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Pricing() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const features = [
    "Brand Awareness",
    "Free Cetak Banner",
    "Free Pasang Banner",
    "Free Listrik & Penerangan",
    "Free Perizinan Tayang Iklan",
    "Termasuk Pajak Reklame",
    "Vehicle Analytics AI",
    "Akses Dashboard Analytics",
    "Creative Ads Concept",
    "Laporan Dokumentasi",
    "Website Premium",
    "Google Bisnis Profile Optimisasi",
  ];

  const FeatureCard = ({ icon, title, desc }) => (
    <div className="rounded-2xl p-10 w-[320px] flex flex-col items-center text-center">
      <div className="bg-lime-400 text-black p-4 rounded-xl mb-4 flex items-center justify-center">
        <img src={icon} alt={title} className="w-12 h-12 object-contain" />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );

  const comparisonData = {
    Basic: [true, true, true, true, true, true, false, false, false, true],
    Pro: [true, false, false, false, false, false, false, true, true, true,true, true],
    Enterprise: [true, true, true, true, true, true, true, true, true, true,true,true],
  };

  const whatsappNumber = '6281318942676';

  const redirectToWhatsapp = ({ packageName = '' } = {}) => {
    const packageLabel = packageName === 'Pro' ? 'Premium' : packageName || 'Basic/Premium/Enterprise';
    const text = `Hallo Travio, saya tertarik dengan layanan travio di paket "${packageLabel}", Mohon info detail harga dan langkah selanjutnya.`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full relative overflow-x-hidden bg-[#060606]">
      {/* Hero Section */}
      <section className="relative w-full h-full ">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bahan/computer.webp')" }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 w-full px-4 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center py-10">
              {/* KIRI — TEXT */}
              <div
                className="text-center md:text-left text-white 
                order-2 md:order-1 
                max-w-xl mx-auto md:mx-0 md:pr-4"
                data-aos="fade-right"
              >
                <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-4">
                  Pasang iklan & analisa <br />
                  dengan cepat
                </h1>

                <p className="text-[#A8DF34] font-bold text-2xl mb-6">
                  Dapatkan diskon hingga 20%
                </p>

                <ul className="text-gray-300 space-y-2 mb-6">
                  <li>• Gratis pemasangan Banner</li>
                  <li>• Instalasi cepat</li>
                  <li>• Monitoring 24/7</li>
                </ul>

                <p className="mb-6 text-white font-bold text-2xl">
                  <span className="font-bold text-[#A8DF34]">mulai</span> Rp
                  26Juta /3 bulan
                </p>

                <button
                  type="button"
                  onClick={() => redirectToWhatsapp({ source: 'Hero Pricing' })}
                  className="bg-[#A8DF34] text-black px-6 py-3 rounded-lg font-bold hover:bg-lime-500 md:text-xl hover:text-white transition"
                >
                  Minta Penawaran
                </button>
              </div>

              {/* KANAN — IMAGE */}
              <div className="relative flex justify-center md:justify-end order-1 md:order-2" data-aos="fade-left">
                <img
                  src="/bahan/price.png"
                  alt="Price"
                  className="w-full max-w-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing-packages" className="bg-black py-24 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center  mb-40 text-white">
            <h2 className="text-5xl md:text-6xl font-bold" data-aos="fade-up">
              Pilih paket Media yang pas untuk <br />{" "}
              <span className="text-[#A8DF34]">Brand Anda</span>
            </h2>
            <p className="text-center mt-6 text-gray-300 text-lg max-w-2xl mx-auto">
              Mulai tanpa ragu dan ambil data iklan anda sekarang juga
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Card Basic */}
            <div className="bg-[#121212] rounded-2xl p-8 text-white shadow-lg min-h-[700px]" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-2xl font-bold text-center border-b-2 pb-4 mb-2 ">
                Basic
              </h3>
              <p className="text-gray-400 text-center mb-16">
                Cocok untuk Marketers yang hanya ingin exposure tanpa analitik
                kompleks
              </p>

              <button
                type="button"
                onClick={() => redirectToWhatsapp({ packageName: 'Basic', source: 'Pricing Card' })}
                className="w-full border border-white text-white hover:bg-[#A8DF34] hover:text-black py-3 rounded-lg mb-6"
              >
                Pilih Paket
              </button>

              <p className="text-sm text-gray-400 mb-6">
                Beli paket 12 bulan dengan harga lebih hemat + gratis pemasangan
                banner.
              </p>

              <h4 className="font-bold border-b-2 pb-2 text-xl mb-4">
                Isi Paket
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  "Media Billboard statis",
                  "Durasi 3 Bulan",
                  "Free cetak banner + pemasangan",
                  "Laporan dokumentasi periodik",
                  "Free listrik + penerangan",
                  "Include Perizinan Tayang Iklan",
                  "Include Pajak Reklame",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[#A8DF34]">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card Pro */}
            <div className="relative bg-[#121212] rounded-2xl p-8 text-white border border-[#A8DF34] shadow-xl scale-105 min-h-[800px]" data-aos="fade-up" data-aos-delay="200">
              {/* Badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#A8DF34] text-black px-6 py-1 rounded-full text-xl font-bold">
                TERLARIS
              </div>

              <h3 className="text-2xl font-bold text-center border-b-2 pb-4 mb-2">
                Pro
              </h3>
              <p className="text-gray-400 text-center mb-16">
                Cocok untuk Marketers yang ingin tahu impact visibility tanpa
                biaya besar
              </p>

              <button
                type="button"
                onClick={() => redirectToWhatsapp({ packageName: 'Pro', source: 'Pricing Card' })}
                className="w-full bg-[#121212] border-white hover:text-black hover:bg-[#A8DF34] overflow-hidden text-white py-3 rounded-lg font-semibold mb-6"
              >
                Pilih Paket
              </button>

              <p className="text-sm text-gray-400 mb-6">
                Beli paket 12 bulan dengan harga lebih hemat + gratis pemasangan
                banner.
              </p>

              <h4 className="font-bold border-b-2 pb-2 text-xl mb-4">
                Isi Paket
              </h4>
              <ul className="space-y-3 text-sm mb-6">
                {[
                  "Google Binis Profile Optimisasi",
                  "Free Website Premium",
                  "Pembaruan konten di GBP",
                  "Balas komentar GMAPS",
                  "Gratis Artikel Relevan",
                  "Setup Google Analytics di website",
                  "Copywriting Profesional",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[#A8DF34]">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card Enterprise */}
            <div className="bg-[#121212] rounded-2xl p-8 text-white border border-white shadow-lg min-h-[820px]" data-aos="fade-up" data-aos-delay="300">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-1 rounded-full text-xl font-bold">
                TERPOPULER
              </div>
              <h3 className="text-2xl font-bold text-center border-b-2 pb-4 mb-2">
                Enterprise
              </h3>
              
              <p className="text-gray-400 text-center mb-16">
                Cocok untuk Marketers yang ingin tahu impact visibility tanpa
                biaya besar
              </p>

              <button
                type="button"
                onClick={() => redirectToWhatsapp({ packageName: 'Enterprise', source: 'Pricing Card' })}
                className="w-full border border-white text-white hover:bg-[#A8DF34] hover:text-black py-3 rounded-lg mb-6"
              >
                Pilih Paket
              </button>

              <p className="text-sm text-gray-400 mb-6">
                Beli paket 12 bulan dengan harga lebih hemat + gratis pemasangan
                banner.
              </p>

              <h4 className="font-bold border-b-2 pb-2 text-xl mb-4">
                Isi Paket
              </h4>
              <ul className="space-y-3 text-sm mb-6">
                {[
                  "Media Billboard premium + AI Analytics",
                  "Durasi 6 Bulan",
                  "Free cetak banner + pemasangan",
                  "Laporan dokumentasi periodik",
                  "Free listrik + penerangan",
                  "Include Perizinan Tayang Iklan",
                  "Include Pajak Reklame",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[#A8DF34]">✔</span>
                    {item}
                  </li>
                ))}
              </ul>

              <h4 className="font-semibold mb-4">Fitur Cerdas</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-[#A8DF34]">✔</span>
                  Vehicle Analytics (Impression count)
                </li>
                <li className="flex gap-3">
                  <span className="text-[#A8DF34]">✔</span>
                  Akses Dashboard by Cloud
                </li>
                <li className="flex gap-3">
                  <span className="text-[#A8DF34]">✔</span>
                  Website premium + GPB
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* TITLE */}
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Bandingkan Paket
            </h2>
            <p className="text-gray-400 text-sm">
              Lihat perbandingan fitur dan sesuaikan kebutuhan anda
            </p>
          </div>

          {/* MOBILE COMPARISON */}
          <div className="md:hidden space-y-5" data-aos="fade-up">
            {[
              { key: 'Basic', subtitle: 'Billboard Only' },
              { key: 'Pro', subtitle: 'Billboard + AI Analytics', badge: 'TERPOPULER' },
              { key: 'Enterprise', subtitle: 'Billboard + AI Analytics + Creative Ads' },
            ].map((plan) => (
              <div key={plan.key} className="bg-[#121212] rounded-2xl border border-gray-800 p-4 relative">
                {plan.badge && (
                  <div className="absolute -top-3 left-4 bg-[#A8DF34] text-black px-3 py-1 rounded-full text-[10px] font-bold">
                    {plan.badge}
                  </div>
                )}

                <h3 className="text-lg font-bold">{plan.key}</h3>
                <p className="text-gray-400 text-xs mt-1 mb-4">{plan.subtitle}</p>

                <button
                  type="button"
                  onClick={() => redirectToWhatsapp({ packageName: plan.key, source: 'Comparison Mobile' })}
                  className="w-full border border-[#A8DF34] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#A8DF34] hover:text-black transition mb-4"
                >
                  Pilih Paket
                </button>

                <div className="space-y-2">
                  {features.map((feature, idx) => (
                    <div key={`${plan.key}-${idx}`} className="flex items-start justify-between gap-3 text-sm border-b border-gray-800 pb-2">
                      <span className="text-gray-300 leading-5">{feature}</span>
                      <span className="text-base leading-none mt-0.5 text-[#A8DF34]">
                        {comparisonData[plan.key][idx] ? '✔' : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP COMPARISON */}
          <div className="hidden md:block">
            {/* HEADER - SELARAS DENGAN TABLE */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {/* KOSONG (UNTUK KOLOM FITUR) */}
              <div></div>

              {/* BASIC */}
              <div className="bg-[#121212] rounded-2xl p-6 flex flex-col h-full text-left">
                <div>
                  <h3 className="text-xl font-bold mb-2">Basic</h3>
                  <p className="text-gray-400 text-sm">Billboard Only</p>
                </div>

                <div className="mt-auto flex justify-center">
                  <button
                    type="button"
                    onClick={() => redirectToWhatsapp({ packageName: 'Basic', source: 'Comparison Table' })}
                    className="w-full border border-[#A8DF34] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#A8DF34] hover:text-black transition"
                  >
                    Pilih Paket
                  </button>
                </div>
              </div>

              {/* PRO */}
              <div className="relative bg-[#121212] rounded-2xl p-6 flex flex-col h-full text-left">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#A8DF34] text-black px-3 py-1 rounded-full text-xs font-bold">
                  TERPOPULER
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Pro</h3>
                  <p className="text-gray-400 text-sm">
                    Billboard + AI Analytics
                  </p>
                </div>

                <div className="mt-auto flex justify-center">
                  <button
                    type="button"
                    onClick={() => redirectToWhatsapp({ packageName: 'Pro', source: 'Comparison Table' })}
                    className="w-full border border-[#A8DF34] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#A8DF34] hover:text-black transition"
                  >
                    Pilih Paket
                  </button>
                </div>
              </div>

              {/* ENTERPRISE */}
              <div className="bg-[#121212] rounded-2xl p-6 flex flex-col h-full text-left">
                <div>
                  <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                  <p className="text-gray-400 text-sm">
                    Billboard + AI Analytics + Creative Ads
                  </p>
                </div>

                <div className="mt-auto flex justify-center">
                  <button
                    type="button"
                    onClick={() => redirectToWhatsapp({ packageName: 'Enterprise', source: 'Comparison Table' })}
                    className="w-full border border-[#A8DF34] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#A8DF34] hover:text-black transition"
                  >
                    Pilih Paket
                  </button>
                </div>
              </div>
            </div>

            {/* FEATURES TABLE */}
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/bahan/Rocket.png"
                alt="Fitur Unggulan"
                className="w-5 h-5"
              />
              <span className="font-bold">Fitur Unggulan</span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="h-14 flex items-center py-2 px-2 text-sm text-gray-300"
                  >
                    {feature}
                  </div>
                ))}
              </div>

              <div className="bg-[#121212] rounded-2xl overflow-hidden">
                {features.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-14 py-2 flex items-center justify-center"
                  >
                    {comparisonData.Basic[idx] ? (
                      <span className="text-[#A8DF34] text-lg">✔</span>
                    ) : (
                      <span className="text-white text-lg">—</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-[#121212] rounded-2xl overflow-hidden">
                {features.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-14 py-2 flex items-center justify-center"
                  >
                    {comparisonData.Pro[idx] ? (
                      <span className="text-[#A8DF34] text-lg">✔</span>
                    ) : (
                      <span className="text-white text-lg">—</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-[#121212] rounded-2xl overflow-hidden">
                {features.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-14 flex items-center justify-center"
                  >
                    {comparisonData.Enterprise[idx] ? (
                      <span className="text-[#A8DF34] text-lg">✔</span>
                    ) : (
                      <span className="text-white text-lg">—</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
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
          <button
            type="button"
            onClick={() => redirectToWhatsapp({ source: 'Pricing CTA' })}
            className="bg-[#A8DF34] text-black px-5 py-2 rounded-lg font-bold text-sm sm:text-base shadow-xl"
          >
            HUBUNGI KAMI SEKARANG
          </button>
        </div>
      </section>
    </div>
  );
}
