import { useEffect, useState } from 'react'
import api from '../../services/api'
import Loading from '../../components/common/Loading'
import { Activity } from 'lucide-react'

const LearningActivityPage = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/users/activity')
      .then((res) => {
        setActivities(res.data.activities)
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
        <h1 className="text-3xl font-bold mb-2">Learning Activity</h1>
        <p className="text-base-content/70">
          Riwayat aktivitas belajar Anda
        </p>
      </div>

      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-base-200"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-base-content/60">
                      {new Date(activity.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-base-content/70">
                Belum ada aktivitas belajar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LearningActivityPage

