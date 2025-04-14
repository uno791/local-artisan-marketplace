import ArtistInfo from "./SideBarComp/ArtistInfo";
import ReviewList from "./SideBarComp/ReviewList";
import "./SidebarInfo.css";

interface Artisan {
  username: string;
}

function SidebarInfo({ username }: Artisan) {
  return (
    <aside className="sidebar-info">
      <ArtistInfo Uname={username} />
      <ReviewList />
    </aside>
  );
}

export default SidebarInfo;

/*import ArtistInfo from "./SideBarComp/ArtistInfo";
import ReviewList from "./SideBarComp/ReviewList";
import "./SidebarInfo.css";

function SidebarInfo() {
  return (
    <aside className="sidebar-info">
      <ArtistInfo />
      <ReviewList />
    </aside>
  );
}

export default SidebarInfo;*/
