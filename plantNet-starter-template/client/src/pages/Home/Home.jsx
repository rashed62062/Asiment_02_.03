import { Helmet } from 'react-helmet-async'
import Carousel from '../../components/Homes/Carousel'
import About from '../../components/Homes/About'
import PackageSection from '../../components/Homes/PackageSection'
// import Add from '../../components/Homes/Add'
// import PackagesPage from '../../components/Homes/PackagesPage'


const Home = () => {
  return (
    <div>
      <Helmet>
        <title> PlantNet | Buy Your Desired Plant</title>
      </Helmet>
      
     
     <Carousel/>
     <About></About>
    
     {/* <PackagesPage></PackagesPage>
     <Add></Add> */}
     <PackageSection></PackageSection>
    </div>
  )
}

export default Home
