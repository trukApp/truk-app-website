'use client'
// import { Truck, PackageCheck, Route, Users, Globe } from "lucide-react";
import { motion } from "framer-motion";
import {   Backdrop, Box, Button, CircularProgress, Grid } from "@mui/material";
// import ImageListItem from "@mui/material/ImageListItem";
import Carousel from "react-material-ui-carousel";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const handleNavigation = (path: string) => {
    setLoading(true);
    router.push(path);
  };
  return (
    <div >
       <Backdrop
        open={loading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <section className="bg-white">
        {/* <h2 className="text-3xl font-bold text-center text-purple-900">Customer Testimonials</h2> */}
        <Carousel autoPlay interval={3000} animation="fade">
          {[
            {
              image: "https://res.cloudinary.com/impargo-gmbh/image/upload/v1666107021/trucker_apps_IMPARGO_2022_01_6e28388ce8.jpg",
              text: "TrukApp made my shipping process so smooth!"
            },
            {
              image: "https://static.vecteezy.com/system/resources/previews/035/769/294/non_2x/delivery-truck-and-smartphone-with-navigation-app-png.png",
              text: "Fast, secure, and affordable – highly recommended."
            },
            {
              image: "https://res.cloudinary.com/impargo-gmbh/image/upload/v1666107021/trucker_apps_IMPARGO_2022_01_6e28388ce8.jpg",
              text: "Booking and tracking has never been easier."
            }
          ].map((item, index) => (
            <div key={index} className="flex flex-col">
              <img src={item.image} alt={`slide-${index}`} style={{height:'500px', width:'100%'}} />
              <p  style={{textAlign:'center', color:'#F08C24', fontSize:'20px'}}>{item.text}</p>
            </div>
          ))}
        </Carousel>
      </section>
      {/* Hero Section */}
    <Grid sx={{ marginLeft: { xs: 0, md: '50px' } }}>
      <section className="relative bg-gradient-to-r from-purple-100 via-white to-pink-100 overflow-hidden p-4 md:p-20">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pink-300 rounded-full opacity-20 blur-3xl z-0"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-300 rounded-full opacity-20 blur-3xl z-0"></div>

        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
          {/* Text content */}
          <div>
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold text-purple-900 leading-tight"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
            Trusted Partner for{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Smart Truck Booking
              </span>
            </motion.h1>

            <p className="text-lg md:text-xl text-gray-700 mt-6 max-w-xl">
              Discover a seamless and secure way to move your goods with real-time tracking, best quotes, and easy booking – all in one place.
            </p>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              >
                <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                  <Button 
                  variant="contained" 
                  onClick={() => handleNavigation('/explore')}
                    sx={{
                      width: '300px',
                      height:'50px',
                          backgroundColor: "#F08C24",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: '#fff',
                            color: "#F08C24"
                          }
                        }}
                      >
                        Explore More
                      </Button>
                </Box>
  
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="flex justify-center"
            >
              <Box sx={{marginTop:'20px'}}>
                          <Image
                                          src="https://res.cloudinary.com/impargo-gmbh/image/upload/v1666107021/trucker_apps_IMPARGO_2022_01_6e28388ce8.jpg"
                                          alt="Start"
                                          width={360}
                                          height={300} 
                                          unoptimized
                                      />
              </Box>
    
          </motion.div>
        </div>
      </section>
    </Grid>
    
      <Grid sx={{ marginLeft: { xs: 0, md: '50px' }, marginTop: '30px' }}>
        <section className="py-24 px-6 bg-gradient-to-b from-pink-100 to-purple-200">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-purple-900 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            Why Choose TrukApp?
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            TrukApp provides an efficient and reliable way to transport your cargo across India. With our trusted carrier network, real-time updates, and competitive pricing, your logistics experience is now hassle-free.
          </motion.p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto items-center">
          {/* <motion.img
            src="https://images.unsplash.com/photo-1601333761826-58e2a4a74074"
            alt="Truck on road"
            className="rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          /> */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-purple-800">Trusted Carriers</h3>
            <p className="text-gray-700">
              Our partner network includes top-rated carriers ensuring safety and timeliness of your cargo.
            </p>
            <h3 className="text-xl font-semibold text-purple-800">Real-Time Tracking</h3>
            <p className="text-gray-700">
              Stay updated with driver geo-location and cargo status in real-time.
            </p>
            <h3 className="text-xl font-semibold text-purple-800">Instant Quotes</h3>
            <p className="text-gray-700">
              Get multiple bids instantly and choose the best deal for your shipment.
            </p>
          </motion.div>
        </div>
      </section>
      </Grid>

    </div>
  );
}
