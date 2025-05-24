import ArtistInfo from "./SideBarSubComp/ArtistInfo";
import ReviewList from "./SideBarSubComp/CategoryList";
import styles from "./SideBarInfo.module.css";
import CategoryList from "./SideBarSubComp/CategoryList";

// props interface
interface Artisan {
  username: string;
  shop_pfp: string;
  shop_name: string;
  mainCategory: string;
  minorTags: string[];
}

// component definition
function SidebarInfo({
  username,
  shop_pfp,
  shop_name,
  mainCategory,
  minorTags,
}: Artisan) {
  return (
    <aside className={styles["sidebar-info"]}>
      <ArtistInfo Uname={username} shop_pfp={shop_pfp} shop_name={shop_name} />
      <CategoryList mainCategory={mainCategory} minorTags={minorTags} />
    </aside>
  );
}

export default SidebarInfo;
