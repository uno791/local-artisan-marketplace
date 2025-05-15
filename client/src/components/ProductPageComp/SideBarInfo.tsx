import ArtistInfo from "./SideBarSubComp/ArtistInfo";
import ReviewList from "./SideBarSubComp/ReviewList";
import styles from "./SideBarInfo.module.css";

interface Artisan {
  username: string;
  shop_pfp: string;
  shop_name: string;
}

function SidebarInfo({ username, shop_pfp, shop_name }: Artisan) {
  return (
    <aside className={styles["sidebar-info"]}>
      <ArtistInfo Uname={username} shop_pfp={shop_pfp} shop_name={shop_name} />
       {/* <ReviewList /> */}
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
