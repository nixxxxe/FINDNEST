import { Sidebar, Modal, Button, Dropdown } from "flowbite-react";
import {
  HiArrowSmRight,
  HiUser,
  HiOutlineExclamationCircle,
  HiClipboardList,
  HiViewGrid,
  HiChevronUp,
  HiChevronDown,
  HiViewBoards,
  HiOutlineDocumentSearch,
  HiUserGroup,
  HiArchive,
} from "react-icons/hi";
import { Disclosure } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  const [showSignoutModal, setShowSignoutModal] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else {
      setTab("profile");
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to sign out");
      }
      dispatch(signoutSuccess());
      setShowSignoutModal(false); // Close modal on successful sign out
    } catch (error) {
      console.error(error.message);
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "superAdmin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "staff":
        return "Staff";
      default:
        return "User"; // default case for unidentified roles or if no role is found
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Sidebar.Item
            active={tab === "analytics"}
            icon={HiViewGrid}
            as={Link}
            to="/dashboard?tab=analytics"
          >
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item
            active={tab === "found-items"}
            icon={HiOutlineDocumentSearch}
            as={Link}
            to="/dashboard?tab=found-items"
          >
            Found Items
          </Sidebar.Item>
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={getRoleLabel(currentUser.role)} // Make sure currentUser and role exist
            labelColor="dark"
            as={Link}
            to="/dashboard?tab=profile"
          >
            Profile
          </Sidebar.Item>
          <Sidebar.Item
            active={tab === "report-form"}
            icon={HiClipboardList}
            as={Link}
            to="/report-form"
          >
            Report Form
          </Sidebar.Item>

          {/* CRUD Dropdown */}
          <div className="flex flex-col gap-2">
            <Sidebar.Item
              icon={HiViewBoards}
              active={tab.startsWith("crud")}
              onClick={() => setTab(tab.startsWith("crud") ? "" : "crud")}
            >
              <div className="flex justify-between w-full">
                CRUD
                {tab.startsWith("crud") ? (
                  <HiChevronUp className="w-5 h-5" />
                ) : (
                  <HiChevronDown className="w-5 h-5" />
                )}
              </div>
            </Sidebar.Item>
            {/* Nested Dropdown Items */}
            {tab.startsWith("crud") && (
              <div className="pl-4 ">
                <Sidebar.Item
                  active={tab === "crud-items"}
                  icon={HiArchive}
                  as={Link}
                  to="/dashboard?tab=crud-items"
                >
                  Items
                </Sidebar.Item>
                {currentUser.role === "admin" && (
                  <Sidebar.Item
                    active={tab === "crud-users"}
                    icon={HiUserGroup}
                    as={Link}
                    to="/dashboard?tab=crud-users"
                  >
                    Users
                  </Sidebar.Item>
                )}
              </div>
            )}
          </div>
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={() => setShowSignoutModal(true)} // Open modal on click
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>

      <Modal
        show={showSignoutModal}
        onClose={() => setShowSignoutModal(false)}
        popup
        size="md"
        className="flex items-center justify-center min-h-screen"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg font-semibold text-gray-500 dark:text-gray-400">
              Are you sure you want to sign out?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleSignout}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowSignoutModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Sidebar>
  );
}
