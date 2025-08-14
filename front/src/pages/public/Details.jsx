import Banner from "../../components/common/Banner";
import Preloader from "../../components/common/Preloader";
import ScrollToTop from "../../components/common/ScrollToTop";
function Details() {
  return (
    <>
      <Banner />
      <Preloader />
      <ScrollToTop />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">Details Page</h1>
        <p className="text-lg">This is the details page.</p>
      </div>
    </>
  );
}
export default Details;
