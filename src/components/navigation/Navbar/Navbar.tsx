// import { UserContext } from "lib/context";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
// import { auth, firestore } from "lib/firebase";

// import { signUserInViaGoogle, signUserOut } from "lib/firebaseFunctions";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../lib/firebase";
import { signUserOut } from "../../../../lib/firebaseFunctions";

export function Navbar({ children }: any) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  // const { user } = useContext(UserContext);
  // @ts-ignore
  const [user] = useAuthState(auth);

  const navigateToLink = (link: string) => {
    setIsDrawerOpen(!isDrawerOpen);
    router.push(link);
  };

  console.log(user);
  return (
    <div className="drawer 0">
      <input
        id="my-drawer-3"
        type="checkbox"
        checked={isDrawerOpen}
        readOnly
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-col">
        {/* <!-- Navbar --> */}
        <div className="w-full navbar bg-base-300 sticky top-0 z-50">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">MovieBox</div>
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal">
              {/* <!-- Navbar menu content here --> */}
              <li>
                <Link href="/movies">Movies</Link>
              </li>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <Link href="/users">Users</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-neutral flex-grow">
          <div className="h-full flex-grow w-full ">{children}</div>
        </div>
        <div className="bg-base-200 ">
          <div className="max-w-4xl px-2 w-full mx-auto py-10"></div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          onClick={() => setIsDrawerOpen(false)}
          className="drawer-overlay "
        ></label>
        <ul className="menu p-4 w-80 bg-base-100">
          {/* <!-- Sidebar content here --> */}
          <li>
            <div onClick={() => navigateToLink("/movies")}>Movies</div>
          </li>
          <li>
            <div onClick={() => navigateToLink("/profile")}>Profile</div>
          </li>
          <li>
            <div onClick={() => navigateToLink("/users")}>Users</div>
          </li>
        </ul>
      </div>
    </div>
  );
}

// import { UserContext } from "lib/context";
// import { useContext } from "react";
// import {
//   Box,
//   Flex,
//   Avatar,
//   Button,
//   Menu,
//   MenuButton,
//   IconButton,
//   MenuList,
//   MenuItem,
//   MenuDivider,
//   useColorModeValue,
//   Stack,
//   useColorMode,
//   useDisclosure,
//   HStack,
//   Text,
// } from "@chakra-ui/react";
// import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
// import NextLink from "next/link";
// import { useRouter } from "next/router";
// import { signUserInViaGoogle, signUserOut } from "lib/firebaseFunctions";

// const Links = [
//   { name: "Films", href: "/Films" },
//   { name: "Top Rated", href: "/movies/top_rated" },
//   { name: "Profile", href: "/profile" },
//   { name: "Users", href: "/users" },
// ];

// const NavLink = ({ children, href }) => (
//   <NextLink
//     px={2}
//     py={1}
//     rounded={"md"}
//     _hover={{
//       textDecoration: "none",
//       bg: useColorModeValue("gray.200", "gray.700"),
//     }}
//     href={href}
//   >
//     {children}
//   </NextLink>
// );

// export function Navbar() {
//   const router = useRouter();
//   const { user } = useContext(UserContext);
//   const { colorMode, toggleColorMode } = useColorMode();
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const navigateToLogin = () => {
//     router.push("/enter");
//   };

//   return (
//     <>
//       <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
//         <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
//           <IconButton
//             size={"md"}
//             icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
//             aria-label={"Open Menu"}
//             display={{ md: "none" }}
//             onClick={isOpen ? onClose : onOpen}
//           />
//           <HStack spacing={8} alignItems={"center"}>
//             <Box>Moviebox</Box>
//             <HStack
//               as={"nav"}
//               spacing={4}
//               display={{ base: "none", md: "flex" }}
//             >
//               {Links.map((link) => (
//                 <NavLink href={link.href} key={link.href}>
//                   {link.name}
//                 </NavLink>
//               ))}
//             </HStack>
//           </HStack>
//           <Stack direction={"row"} spacing={2}>
//             <Button onClick={toggleColorMode}>
//               {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
//             </Button>

//             {user ? (
//               <Menu>
//                 <MenuButton
//                   as={Button}
//                   rounded={"full"}
//                   variant={"link"}
//                   cursor={"pointer"}
//                   minW={0}
//                 >
//                   <Avatar size={"sm"} src={user?.photoURL} />
//                 </MenuButton>
//                 <MenuList alignItems={"center"}>
//                   <MenuItem>
//                     <Text fontSize="sm">Account Settings</Text>
//                   </MenuItem>
//                   <MenuItem>
//                     <Text fontSize="sm">About</Text>
//                   </MenuItem>
//                   <MenuDivider />
//                   <MenuItem onClick={signUserOut}>
//                     <Text fontSize="sm">Logout</Text>
//                   </MenuItem>
//                 </MenuList>
//               </Menu>
//             ) : (
//               <Button onClick={navigateToLogin}>Link</Button>
//             )}
//           </Stack>
//         </Flex>

//         {isOpen ? (
//           <Box pb={4} display={{ md: "none" }}>
//             <Stack as={"nav"} spacing={4}>
//               {Links.map((link) => (
//                 <NavLink key={link}>{link}</NavLink>
//               ))}
//             </Stack>
//           </Box>
//         ) : null}
//       </Box>
//     </>
//   );
// }
