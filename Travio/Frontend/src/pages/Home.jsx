import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import CountUp from "react-countup";
import { fetchPublishedBlogs, submitContactMessage } from "../services/adminApi";
import { resolveImageUrl } from "../utils/imageUrl";
import { toExcerpt } from "../utils/content";
import "aos/dist/aos.css";

export default function Home() {
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [heroLabel, setHeroLabel] = useState("BRAND");
  const [isLabelFading, setIsLabelFading] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [contactStatus, setContactStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLabelFading(true);
      setTimeout(() => {
        setHeroLabel((prev) => (prev === "BRAND" ? "MEDIA" : "BRAND"));
        setIsLabelFading(false);
      }, 300);
    }, 3600);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadHomeBlogs = async () => {
      try {
        setBlogLoading(true);
        setBlogError("");
        const res = await fetchPublishedBlogs(1, 3);
        setBlogPosts(res.data || []);
      } catch (err) {
        setBlogError(err.message || "Gagal memuat berita terbaru.");
      } finally {
        setBlogLoading(false);
      }
    };

    loadHomeBlogs();
  }, []);

  const formatDate = (value) =>
    new Date(value).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setContactStatus({
        type: "error",
        message: "Name, Email, dan Message wajib diisi.",
      });
      return;
    }

    try {
      setContactSending(true);
      setContactStatus({ type: "", message: "" });
      await submitContactMessage(payload);
      setContactStatus({ type: "success", message: "Pesan berhasil dikirim." });
      form.reset();
    } catch (err) {
      setContactStatus({
        type: "error",
        message: err.message || "Gagal mengirim pesan.",
      });
    } finally {
      setContactSending(false);
    }
  };

  return (
    <div className="w-full relative overflow-x-hidden">
      {/* Fixed Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: "url('/bahan/Images-Website.webp')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-screen ">
        <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <h2
            className="text-4xl md:text-6xl font-bold mb-4"
            data-aos="fade-up"
          >
            <span>HALLO</span>
            <span
              className={`ml-2 text-4xl md:text-6xl text-black rounded-xl px-2 bg-[#A8DF34] font-bold transition-opacity duration-300 ${isLabelFading ? "opacity-0" : "opacity-100"}`}
            >
              {heroLabel}
            </span>
          </h2>
          <p
            className="text-2xl md:text-3xl font-bold mb-6 mt-2"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Kami bantu pertumbuhan brand Anda secara organik dan massive
          </p>
          <p className="font-light text-xl md:text-2xl text-white mt-14">
            Tersedia berbagai macam layanan eksklusif
          </p>
          <p className="text-2xl md:text-3xl mb-8 max-w-full md:max-w-4xl font-bold mt-2">
            Melayani Jasa Sewa Billboard | Jasa Bikin Website | Jasa Optimasi Google Business Profile 
          </p>

          <div data-aos="fade-up" data-aos-delay="300">
            <button className="border-2 bg-[#A8DF34] text-black hover:text-gray-700 px-8 py-3 rounded-lg transition font-bold text-lg">
              Mulai Kampanye
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="w-full text-white py-0"
        onMouseEnter={() => setIsStatsVisible(true)}
      >
        <div className="max-w-6xl mx-auto px-4 -mt-12 py-16">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-8 max-w-xl mx-auto md:max-w-lg lg:max-w-xl"
            data-aos="fade-up"
          >
            Kolaborasi dengan kami dan ukur keberhasilan kampanye OOH
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center mt-6">
            <div data-aos="fade-up" data-aos-delay="100">
              <div className="text-5xl md:text-6xl font-bold text-[#A8DF34] mb-2">
                {isStatsVisible ? (
                  <CountUp start={0} end={600} duration={2.5} />
                ) : (
                  0
                )}
                <span>+</span>
              </div>
              <p className="text-gray-300 text-lg">KERJASAMA BRAND</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="text-5xl md:text-6xl font-bold text-[#A8DF34] mb-2">
                {isStatsVisible ? (
                  <CountUp start={0} end={80} duration={2.5} />
                ) : (
                  0
                )}
                <span>%+</span>
              </div>
              <p className="text-gray-300 text-lg">TINGKAT RETENTION</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
              <div className="text-5xl md:text-6xl font-bold text-[#A8DF34] mb-2">
                {isStatsVisible ? (
                  <CountUp start={0} end={100} duration={2.5} />
                ) : (
                  0
                )}
                <span>+</span>
              </div>
              <p className="text-gray-300 text-lg">KOTA MEDIA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Billboard Section */}
      <section className="w-full bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-xl md:text-4xl font-semibold text-gray-900 mb-6">
              Sewa media billboard tanpa keraguan
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Layanan Billboard kami terdapat opsi dukungan Vision AI, di mana
              anda akan mendapatkan fasilitas monitoring traffic kendaraan atau
              manusia di lokasi iklan anda secara real-time.
            </p>
            <button className="bg-[#A8DF34] text-black px-6 py-3 rounded-lg transition font-medium shadow-2xl">
              Konsultasi Gratis
            </button>
          </div>
          <div data-aos="fade-left">
            <img
              src="/bahan/billboard.webp"
              alt="Billboard Dashboard"
              className="w-full transition-transform duration-300 ease-out hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="w-full bg-[#A8DF34] py-32">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <img
              src="/bahan/3.webp"
              alt="Analytics Dashboard"
              className="w-full rounded-lg shadow-xl transition-transform duration-300 ease-out hover:scale-105"
            />
          </div>
          <div className="text-gray-900" data-aos="fade-left">
            <h2 className="text-2xl md:text-4xl font-semibold mb-6">
              Monitoring dan analisis dalam 1 Dashboard
            </h2>
            <p className="text-lg mb-6">
              Travio platform akan membantu anda monitoring dan analisis data
              traffic setiap titik iklan billboard anda secara real-time,
              dapatkan data nyata, bukan asumsi.
            </p>
            <button className="bg-gray-900 border-white shadow-2xl text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold">
              Request proposal
            </button>
          </div>
        </div>
      </section>

      {/* Optimization Section */}
      <section className="w-full bg-[#181818] py-24">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl font-medium text-[#A8DF34] mb-6">
              Optimalkan waktu anda untuk hal yang lebih kompleks
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Anda cukup masuk ke dashboard dan lakukan perubahan sesuai dengan
              kebutuhan data anda, kami ingin memastikan waktu anda optimal
              untuk pekerjaan kampanye anda termasuk ROI.
            </p>
          </div>
          <div data-aos="fade-left">
            <img
              src="/bahan/9.webp"
              alt="Analytics"
              className="w-full rounded-lg shadow-xl transition-transform duration-300 ease-out hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Traffic Measurement Section */}
      <section className="w-full bg-[#181818] py-28">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden" data-aos="fade-right">
            <img
              src="/bahan/website.webp"
              alt="OOH Media Measurement"
              className="w-full scale-105 transition-transform duration-500 ease-out hover:scale-110"
            />
          </div>
          <div data-aos="fade-left">
            <h2 className="text-3xl md:text-4xl font-medium text-[#A8DF34] mb-6">
              Layanan bikin website yang menunjang pertumbuhan brand anda
            </h2>
            <p className="text-white text-lg mb-6">
              Buat konsumen mudah menemukan anda dari pencarian mereka di
              google, tim kami membantu anda menciptakan website sesuai dengan
              keinginan anda dengan berbagai bonus yang dapat anda jadikan
              pengalaman dalam layanan bisnis
            </p>
          </div>
        </div>
      </section>

      {/* Inspection Section */}
      <section className="w-full bg-black text-white py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-[#A8DF34] max-w-lg">
              Lakukan pemasaran secara maksimal dengan layanan Digital dari
              Google
            </h2>
            <p className="text-white text-lg mb-6">
              Kami membantu brand anda untuk tumbuh secara organik dan
              sustainable denga dukungan layanan Optimisasi Google Bisnis
              Profile dan pembuatan website premium
            </p>
            <button className="bg-[#A8DF34] text-black px-6 py-3 mt-4 rounded-lg  transition font-semibold">
              Jadwalkan Meeting
            </button>
          </div>
          <div data-aos="fade-left">
            <img
              src="/bahan/data-analytic.webp"
              alt="Inspection Technology"
              className="w-full rounded-lg shadow-xl transition-transform duration-300 ease-out hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full bg-black py-24">
        <div className="max-w-6xl mx-auto px-4" data-aos="fade-up">
          <h2 className="text-3xl text-[#A8DF34] md:text-4xl font-bold mb-12 text-center">
            TEMUKAN KEAJAIBAN LAYANAN KAMI DENGAN PEMBELIAN PAKET LENGKAP
          </h2>

          <div className="grid md:grid-cols-3 gap-8 py-16">
            {/* Basic Card */}
            <div
              className="rounded-2xl p-5 bg-[#121212]"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <h3 className="text-2xl font-bold text-center text-white mb-4">
                Basic
              </h3>
              <div className="w-[calc(100%-40px)] h-[1px] bg-white mx-auto mb-4"></div>
              <p className="text-gray-200 text-sm mb-6">
                Cocok untuk Brand yang hanya ingin exposure tanpa analitik
                kompleks
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-white">
                  <svg
                    className="w-5 h-5 text-[#A8DF34]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Media Billboard statis</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <svg
                    className="w-5 h-5 text-[#A8DF34]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Durasi Min 3 Bulan</span>
                </div>
              </div>
              <div className="flex justify-center">
                <Link
                  to="/pricing#pricing-packages"
                  className="text-white outline px-4 py-2 rounded-lg hover:bg-[#A8DF34] hover:text-black transition"
                >
                  Selengkapnya
                </Link>
              </div>
            </div>

            {/* Premium Card */}
            <div
              className="rounded-2xl p-5 bg-[#121212] "
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h3 className="text-2xl font-bold text-center text-white mb-4">
                Premium
              </h3>
              <div className="w-[calc(100%-40px)] h-[1px] bg-white mx-auto mb-4"></div>
              <p className="text-gray-200 text-sm mb-6">
                Cocok bagi brand yang ingin ditemukan dari mesin pencari
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-white">
                  <svg
                    className="w-5 h-5 text-[#A8DF34]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Google Profile Bisnis Optimisasi</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <svg
                    className="w-5 h-5 text-[#A8DF34]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Website premium</span>
                </div>
              </div>
              <div className="flex justify-center">
                <Link
                  to="/pricing#pricing-packages"
                  className="text-white outline px-4 py-2 rounded-lg hover:bg-[#A8DF34] hover:text-black transition"
                >
                  Selengkapnya
                </Link>
              </div>
            </div>

            {/* Enterprise Card */}
            <div
              className="rounded-2xl p-5 bg-[#121212]"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <h3 className="text-2xl font-bold text-center text-white mb-4">
                Enterprise
              </h3>
              <div className="w-[calc(100%-40px)] h-[1px] bg-white mx-auto mb-4"></div>
              <p className="text-gray-200 text-sm mb-6">
                Cocok bagi brand yang ingin tumbuh lebih cepat dan terukur
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-white">
                  <svg
                    className="w-5 h-5 text-[#A8DF34]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Sewa Billboard + Analitik AI</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <svg
                    className="w-5 h-5 text-[#A8DF34]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Website premium + GPB</span>
                </div>
              </div>
              <div className="flex justify-center">
                <Link
                  to="/pricing#pricing-packages"
                  className="text-white outline px-4 py-2 rounded-lg hover:bg-[#A8DF34] hover:text-black transition"
                >
                  Selengkapnya
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="w-full bg-black text-white py-2 pb-32">
        <div className="max-w-6xl mx-auto px-4">
          <div
            className="flex items-center justify-between mb-8"
            data-aos="fade-up"
          >
            <h2 className="text-2xl md:text-3xl font-bold">Berita Terbaru</h2>
            <Link
              to="/blog"
              className="text-xl md:text-xl text-gray-600 hover:text-[#A8DF34] transition"
            >
              Lihat semua
            </Link>
          </div>

          {blogLoading ? (
            <div className="text-gray-300">Memuat berita...</div>
          ) : blogError ? (
            <div className="text-red-400">{blogError}</div>
          ) : blogPosts.length === 0 ? (
            <div className="text-gray-300">
              Belum ada berita yang dipublish.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <Link
                  to={`/blog/${post.slug}`}
                  key={post.id}
                  data-aos="fade-up"
                  data-aos-delay={(index + 1) * 80}
                  className="bg-[#121212] border block border-gray-800 rounded-2xl overflow-hidden hover:border-gray-200"
                >
                  <Link>
                    {post.cover_image ? (
                      <img
                        src={resolveImageUrl(post.cover_image)}
                        alt={post.title}
                        className="w-full h-44 object-cover"
                      />
                    ) : (
                      <div className="w-full h-44 bg-gray-800" />
                    )}
                  </Link>

                  <div className="p-5">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 mb-2">
                      {formatDate(post.created_at)}
                    </p>
                    <h3 className="text-lg font-light leading-7 mb-3 line-clamp-2 text-white">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-6 mb-4 line-clamp-3">
                      {toExcerpt(post.content)}
                    </p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-[#A8DF34] font-semibold text-sm hover:text-[#b7ef3f] transition"
                    >
                      Baca selengkapnya &rarr;
                    </Link>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="w-full py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-12"
            data-aos="fade-up"
          >
            CONTACT <span className="text-[#A8DF34]">US</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div data-aos="fade-right">
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-[#A8DF34] focus:outline-none"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-[#A8DF34] focus:outline-none"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="No Handphone"
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-[#A8DF34] focus:outline-none"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-[#A8DF34] focus:outline-none"
                  />
                </div>
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="4"
                  required
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-[#A8DF34] focus:outline-none resize-none"
                ></textarea>
                {contactStatus.message && (
                  <p
                    className={`text-sm ${
                      contactStatus.type === "success" ? "text-[#A8DF34]" : "text-red-400"
                    }`}
                  >
                    {contactStatus.message}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={contactSending}
                  className="w-full bg-[#A8DF34] text-black px-8 py-3 rounded-lg transition font-semibold text-lg"
                >
                  {contactSending ? "Sending..." : "Sent Message"}
                </button>
              </form>
            </div>
            <div
              className="h-96 bg-gray-800 rounded-lg overflow-hidden"
              data-aos="fade-left"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d495.89732151583553!2d106.12989935480176!3d-6.106641757592453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e418bcc96e48497%3A0x20699ae9b53d80d6!2sCV%20BYAN%20CENTRAL%20COMPUTER!5e0!3m2!1sen!2sid!4v1768737592428!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
