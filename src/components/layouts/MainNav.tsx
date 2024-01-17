import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

const ROUTES = {
  HOME: "/",
  OFFSET_PAGINATION: "/offset-pagination",
  BASED_PAGINATION_WITH_FILTERS: "/pagination-with-filters",
  OFFSET_PAGINATION_EXPANDED: "/offset-pagination-expanded",
  CREATE_DEAL: "/create-deal",
  SCROLL_OFFSET_PAGINATION: "/scroll-offset-pagination",
  OPTIMISTIC_UI: "/optimistic-ui",
};

const MainNav = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={ROUTES.HOME} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Basics</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Link href={ROUTES.CREATE_DEAL} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Mutation - update cache
              </NavigationMenuLink>
            </Link>
            <Link href={ROUTES.OPTIMISTIC_UI} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Mutation - Optimistic UI
              </NavigationMenuLink>
            </Link>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Pagination</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Link href={ROUTES.OFFSET_PAGINATION} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Offset Pagination
              </NavigationMenuLink>
            </Link>
            <Link
              href={ROUTES.SCROLL_OFFSET_PAGINATION}
              legacyBehavior
              passHref
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Scroll offset pagination
              </NavigationMenuLink>
            </Link>
            <Link
              href={ROUTES.OFFSET_PAGINATION_EXPANDED}
              legacyBehavior
              passHref
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Offset pagination expanded
              </NavigationMenuLink>
            </Link>
            <Link
              href={ROUTES.BASED_PAGINATION_WITH_FILTERS}
              legacyBehavior
              passHref
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Based pagination /w Filters
              </NavigationMenuLink>
            </Link>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNav;
