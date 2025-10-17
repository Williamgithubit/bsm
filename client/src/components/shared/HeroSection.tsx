'use client';
import Button from '@/components/ui/Button';
import ImageSlider from '@/components/ui/ImageSlider';
import Counter from '@/components/ui/Counter';

const images = [
  { src: '/assets/3.jpg', alt: 'Football team training on the field' },
  { src: '/assets/4.jpg', alt: 'Young athlete kicking a football' },
  { src: '/assets/2.jpg', alt: 'Community football match in Liberia' },
  { src: '/assets/1.jpg', alt: 'Coach mentoring a young football player' },
  { src: '/assets/12.jpg', alt: 'Athletes celebrating a victory' },
  { src: '/assets/6.jpg', alt: 'Crowd at a football tournament' },
  { src: '/assets/11.jpg', alt: 'Young players receiving new football kits' },
  { src: '/assets/13.jpg', alt: 'Young players receiving new football kits' },
];

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-[#03045e] to-[#1a1a6e] text-white w-full pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <div className="mt-0 lg:mt-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Building Champions from Grassroots to Glory
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 text-gray-200">
              Empowering Liberian youth through football scouting, training, and community outreach with Benzard Sports Management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                as="link" 
                href="/programs"
                variant="secondary"
                size="lg"
                className="rounded-md bg-[#E32845] hover:text-[#03045e] hover:bg-[#30ddec]"
              >
                Explore Programs
              </Button>
              <Button 
                as="link" 
                href="/contact"
                variant="custom"
                size="lg"
                className="rounded-md border-[#E32845] text-[#E32845] hover:bg-[#E32845] hover:text-[#03045e]"
              >
                Join BSM
              </Button>
            </div>
          </div>

          {/* Image Slider Section */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[3/2] lg:aspect-[5/3] xl:aspect-[21/9]">
            <ImageSlider images={images} interval={30000} />

            {/* Counters - repositioned responsively */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white p-4 sm:p-6 rounded-lg shadow-lg z-10">
              <div className="text-2xl sm:text-3xl font-bold text-[#E32845]">
                <Counter end={150} duration={2000} />+
              </div>
              <div className="text-gray-600 text-sm sm:text-base">Athletes Trained</div>
            </div>

            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white p-4 sm:p-6 rounded-lg shadow-lg z-10">
              <div className="text-2xl sm:text-3xl font-bold text-[#E32845]">
                <Counter end={10} duration={2000} />+
              </div>
              <div className="text-gray-600 text-sm sm:text-base">Events Hosted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;