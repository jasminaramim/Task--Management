import { useContext } from 'react'
import { AuthContext } from '../Providers/AuthProviders.jsx'

const useAuth = () => {
  const auth = useContext(AuthContext)
  return auth
}

export default useAuth