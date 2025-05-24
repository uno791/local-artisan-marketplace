import ArtistInfo from "./SideBarSubComp/ArtistInfo";
import ReviewList from "./SideBarSubComp/CategoryList"; // likely incorrect import (see comment below)
import styles from "./SideBarInfo.module.css";
import CategoryList from "./SideBarSubComp/CategoryList";

// props for displaying artisan and category info
interface Artisan {
  username: string;
  shop_pfp: string;
  shop_name: string;
  mainCategory: string;
  minorTags: string[];
}

function SidebarInfo({
  username,
  shop_pfp,
  shop_name,
  mainCategory,
  minorTags,
}: Artisan) {
  return (
    // sidebar section containing artist and category info
    <aside className={styles["sidebar-info"]}>
      {/* display artist card */}
      <ArtistInfo Uname={username} shop_pfp={shop_pfp} shop_name={shop_name} />

      {/* display product categories */}
      <CategoryList mainCategory={mainCategory} minorTags={minorTags} />
    </aside>
  );
}

export default SidebarInfo;
