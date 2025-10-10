import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CarouselContext = React.createContext(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

const Carousel = React.forwardRef(
  ({ opts, plugins, className, children, ...props }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        ...opts,
        axis: opts?.axis || "x",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api) => {
      if (!api) {
        return
      }
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      emblaApi?.scrollPrev()
    }, [emblaApi])

    const scrollNext = React.useCallback(() => {
      emblaApi?.scrollNext()
    }, [emblaApi])

    const handleKeyDown = React.useCallback(
      (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!emblaApi) {
        return
      }
      onSelect(emblaApi)
      emblaApi.on("reInit", onSelect)
      emblaApi.on("select", onSelect)

      return () => {
        emblaApi?.off("select", onSelect)
      }
    }, [emblaApi, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef: emblaRef,
          api: emblaApi,
          opts,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={`relative ${className || ''}`}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { carouselRef } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={`flex ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={`min-w-0 shrink-0 grow-0 basis-full ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef(
  ({ className, variant = "outline", size = "icon", children, ...props }, ref) => {
    const { scrollPrev, canScrollPrev } = useCarousel()

    return (
      <button
        ref={ref}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all ${className || ''}`}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ChevronLeft className="h-6 w-6" />
        {children}
      </button>
    )
  }
)
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef(
  ({ className, variant = "outline", size = "icon", children, ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel()

    return (
      <button
        ref={ref}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all ${className || ''}`}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ChevronRight className="h-6 w-6" />
        {children}
      </button>
    )
  }
)
CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
