import { useContext } from "react"
import { UserContext } from "../../userContext"

const Profile = () => {
  const { user, isAuthenticated } = useContext(UserContext)
  return (
    <div>
      MOi tässä on käyttäjän profiili
      Käyttäjä on {user?.username}
    </div>
  )
}

export default Profile