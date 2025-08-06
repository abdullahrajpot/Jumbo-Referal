import { useTranslation } from "react-i18next";

export function getMenus() {
  const { t } = useTranslation();
  return [
    {
      label: t("sidebar.menu.sample"),
      children: [
        {
          path: "/dashboard",
          label: "Dashboard",
          icon: "dashboard",
        },
        {
          path: "/",
          label: t("sidebar.menuItem.sample"),
          icon: "sample",
        },
        {
          path: "/user/deposit",
          label: "Deposit",
          icon: "wallet",
        },
        {
          path: "/mlm-tree",
          label: "MLM Tree",
          icon: "mlm",
        },
        {
          path: "/products",
          label: "Products",
          icon: "products",
        },
         {
          path: "/orders",
          label: "Orders",
          icon: "orders",
        },
        
      ],
    },
  ];
}
