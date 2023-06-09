// Define a functional component for a custom 404 page
export default function Custom404() {
  const goBack = () => {
    window.history.back()
  }
  // The component returns a 404 page with a message and two buttons for navigating back or to the home page
  return (
    <div className="grid mx-5 justify-center mt-10">
      <h1 className="text-xl text-lightdijon font-semibold">
        `Sorry, we couldn&apos;t find what you&apos;re looking for.`
      </h1>
      <button onClick={goBack} className=" mt-10 uppercase tracking-wide justify-center drop-shadow-xl text-xl border border-dijon text-dijon bg-brendan/50 hover:bg-brendan/80 focus:ring-4 focus:outline-none focus:ring-[#F8DE7F]/50 font-medium rounded-xl mb-6 py-2 dark:focus:ring-[#3b5998]/55">
        back
      </button>
      <button onClick={goBack} className="uppercase tracking-wide justify-center drop-shadow-xl text-xl border border-dijon text-dijon bg-brendan/50 hover:bg-brendan/80 focus:ring-4 focus:outline-none focus:ring-[#F8DE7F]/50 font-medium rounded-xl mb-6 py-2 dark:focus:ring-[#3b5998]/55">
        home
      </button>
    </div>
  )
}
