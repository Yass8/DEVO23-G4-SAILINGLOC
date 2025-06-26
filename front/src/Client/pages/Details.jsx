import Banner from "../components/Banner";
function Details() {
  return ( 
    <>
    <Banner/>
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Details Page</h1>
      <p className="text-lg">This is the details page.</p>
    </div>
    </>
  );
  
}
export default Details;