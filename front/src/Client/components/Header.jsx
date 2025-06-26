const Header = () => {
  return (
    <header className="bg-blue-800 text-white p-4 shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-lg font-bold">SAILINGLOC</h1>
        <nav className="space-x-4 text-sm hidden md:block">
          <a href="#" className="hover:underline">Accueil</a>
          <a href="#" className="hover:underline">Catégories</a>
          <a href="#" className="hover:underline">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
