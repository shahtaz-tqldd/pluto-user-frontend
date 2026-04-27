import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userDetailsFetched } from "@/features/auth/authSlice";
import { useMeQuery } from "@/features/auth/authApiSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data, isSuccess, isLoading, refetch } = useMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (isAuthenticated && isSuccess && data?.data) {
      dispatch(userDetailsFetched(data.data));
    }
  }, [isSuccess, data, dispatch, isAuthenticated]);

  const authChecked = !isAuthenticated || isSuccess;

  return {
    isLoading: isLoading || (isAuthenticated && !authChecked),
    authChecked,
    refetchProfile: refetch,
  };
};

export default useAuth;
