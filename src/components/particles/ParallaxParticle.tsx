'use client';
import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { type ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { motion, AnimatePresence } from 'motion/react';

const ParallaxParticles = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fpsLimit: 60,
      particles: {
        number: {
          value: 80, // Reduced number of particles to half
          density: {
            enable: true,
            value_area: 400,
          },
        },
        color: {
          value: ['#d946ef', '#6d28d9', '#ec4899'],
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.3,
            sync: false,
          },
        },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          random: true,
          straight: false,
          outModes: {
            default: 'out',
          },
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
        links: {
          enable: true,
          distance: 200,
          color: '#d946ef',
          opacity: 0.5,
          width: 1,
        },
      },
      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: {
            enable: true,
            mode: 'connect',
          },
          resize: {
            enable: true,
            delay: 0,
            factor: 1,
          },
        },
        modes: {
          connect: {
            distance: 150,
            links: {
              opacity: 0.4,
            },
            radius: 120,
          },
          remove: {
            quantity: 2,
          },
        },
      },
      detectRetina: true,
      background: {
        color: 'transparent',
        image: '',
        position: '50% 50%',
        repeat: 'no-repeat',
        size: 'cover',
      },
      motion: {
        disable: false,
        reduce: {
          factor: 4,
          value: false,
        },
      },
    }),
    [],
  );

  if (init) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-0 h-full w-full"
        >
          <Particles className="h-full w-full" id="parallaxParticles" options={options} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return <></>;
};

export default ParallaxParticles;
