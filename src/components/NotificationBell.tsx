import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchUnreadCounts,
  fetchNotifications,
  markNotificationAsRead,
} from "@/lib/features/notifications/notificationSlice";
interface NotificationType {
  _id: string;
  message: string;
  link: string;
  createdAt: string;
}
const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { userInfo } = useSelector((state: RootState) => state.user);

  const { totalUnreadCount, notifications, status } = useSelector(
    (state: RootState) => state.notifications
  );

  useEffect(() => {
    if (userInfo?.token) {
      dispatch(fetchUnreadCounts());

      const intervalId = setInterval(() => {
        dispatch(fetchUnreadCounts());
      }, 30000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (isOpen && userInfo?.token) {
      dispatch(fetchNotifications());
    }
  }, [isOpen, dispatch, userInfo]);
  const handleNotificationClick = (notification: NotificationType) => {
    if (!userInfo) {
      return;
    }
    dispatch(markNotificationAsRead(notification._id));
    setIsOpen(false);
    navigate(notification.link);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-300 hover:text-white"
        >
          <Bell className="h-6 w-6" />
          {totalUnreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-600 rounded-full">
              {totalUnreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4" align="end">
        <div className="p-4 font-bold border-b text-gray-800">
          Notifications
        </div>
        <div className="max-h-96 overflow-y-auto">
          {status === "loading" && notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className="p-3 border-b hover:bg-gray-100 cursor-pointer text-sm transition-colors"
                onClick={() => handleNotificationClick(notif)}
              >
                <p className="font-medium text-gray-900">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No new notifications
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default NotificationBell;
