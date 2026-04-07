import { useEffect, useState } from 'react'
import api from '../../services/api'
import Loading from '../../components/common/Loading'
import { Award, Download } from 'lucide-react'

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/certificates')
      .then((res) => {
        setCertificates(res.data.certificates)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Certificates</h1>
        <p className="text-base-content/70">
          Sertifikat yang telah Anda peroleh
        </p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
            >
              <figure>
                <img
                  src={certificate.course.thumbnail || '/placeholder-course.jpg'}
                  alt={certificate.course.title}
                  className="w-full h-32 object-cover"
                />
              </figure>
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-warning" />
                  <h3 className="card-title text-lg">{certificate.course.title}</h3>
                </div>
                <p className="text-sm text-base-content/60">
                  Diterbitkan: {new Date(certificate.issuedAt).toLocaleDateString('id-ID')}
                </p>
                <div className="card-actions justify-end mt-4">
                  <a
                    href={certificate.certificateUrl}
                    download
                    className="btn btn-primary btn-sm"
                  >
                    <Download className="w-4 h-4" />
                    Unduh
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body text-center py-12">
            <Award className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
            <p className="text-xl text-base-content/70">
              Belum ada sertifikat
            </p>
            <p className="text-sm text-base-content/60 mt-2">
              Selesaikan course untuk mendapatkan sertifikat
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CertificatesPage

