// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import bgimg2 from '../../assets/images/carousel2.jpg'
import bgimg3 from '../../assets/images/carousel3.jpg'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import Slide from './Slide'
import Slider from './Slider'



export default function Carousel() {
  return (
    <div className='container px-6 py-10 mx-auto'>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className='mySwiper'
      >
     
        <SwiperSlide>
          <Slide
            image={bgimg2}
            text='Get Your Graphics Design Projects Done in minutes'
          />
        </SwiperSlide>
        <SwiperSlide>
          <Slider
            image={bgimg3}
            text='Start Your Digital Marketing Campaigns up n running'
          />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
