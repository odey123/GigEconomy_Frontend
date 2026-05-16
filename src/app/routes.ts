import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import BVNVerification from "./pages/BVNVerification";
import ProfileSetupOwner from "./pages/ProfileSetupOwner";
import ProfileSetupHelper from "./pages/ProfileSetupHelper";
import OwnerDashboard from "./pages/OwnerDashboard";
import PostGigPicker from "./pages/PostGigPicker";
import PostGigSales from "./pages/PostGigSales";
import PostGigTask from "./pages/PostGigTask";
import HelperDashboard from "./pages/HelperDashboard";
import GigDetail from "./pages/GigDetail";
import ApplicantsList from "./pages/ApplicantsList";
import ApplicantDetail from "./pages/ApplicantDetail";
import MatchConfirmed from "./pages/MatchConfirmed";
import MyContracts from "./pages/MyContracts";
import ContractDetailSales from "./pages/ContractDetailSales";
import ContractDetailTask from "./pages/ContractDetailTask";
import Wallet from "./pages/Wallet";
import CustomerPayment from "./pages/CustomerPayment";
import Profile from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/verify-bvn",
    Component: BVNVerification,
  },
  {
    path: "/profile-setup/owner",
    Component: ProfileSetupOwner,
  },
  {
    path: "/profile-setup/helper",
    Component: ProfileSetupHelper,
  },
  {
    path: "/dashboard",
    Component: OwnerDashboard,
  },
  {
    path: "/post-gig",
    Component: PostGigPicker,
  },
  {
    path: "/post-gig/sales",
    Component: PostGigSales,
  },
  {
    path: "/post-gig/task",
    Component: PostGigTask,
  },
  {
    path: "/helper-dashboard",
    Component: HelperDashboard,
  },
  {
    path: "/gig/:id",
    Component: GigDetail,
  },
  {
    path: "/gig/:id/applicants",
    Component: ApplicantsList,
  },
  {
    path: "/gig/:id/applicants/:applicantId",
    Component: ApplicantDetail,
  },
  {
    path: "/gig/:id/applicants/:applicantId/approved",
    Component: MatchConfirmed,
  },
  {
    path: "/contracts",
    Component: MyContracts,
  },
  {
    path: "/contracts/:id",
    Component: ContractDetailSales,
  },
  {
    path: "/contracts/:id/task",
    Component: ContractDetailTask,
  },
  {
    path: "/wallet",
    Component: Wallet,
  },
  {
    path: "/pay/:linkId",
    Component: CustomerPayment,
  },
  {
    path: "/profile",
    Component: Profile,
  },
]);
