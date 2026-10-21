using System;
using System.Runtime.InteropServices;
class NotificationSettings {
 const string Lib="/usr/lib/libnotification.so.0";
 static readonly string[] Apps={"org.tizen.tv.swu", "org.tizen.tv.swu-update-details"};
 static void Check(int rc,string op) {if(rc!=0)throw new Exception(op+" failed: "+rc);}
 static IntPtr Get(string app) {IntPtr h;Check(notification_setting_get_setting_by_appid_for_uid(app,out h,5001),"read "+app);if(h==IntPtr.Zero)throw new Exception("Null handle");return h;}
 static bool Popup(IntPtr h) {bool v;Check(notification_setting_get_pop_up_notification(h,out v),"read popup");return v;}
 static void Set(string app,bool value) {IntPtr h=Get(app);try {Check(notification_setting_set_pop_up_notification(h,value),"set popup");Check(notification_setting_update_setting_for_uid(h,5001),"save "+app);}finally{notification_setting_free_notification(h);}h=Get(app);try {if(Popup(h)!=value)throw new Exception("Readback mismatch "+app);}finally{notification_setting_free_notification(h);}}
 static int Main(string[] args) {
  try {
   if(args.Length>1 || (args.Length==1 && args[0]!="quiet" && args[0]!="restore"))throw new Exception("Usage: NotificationSettings [quiet|restore]");
   bool[] before=new bool[Apps.Length];
   for(int i=0;i<Apps.Length;i++){var h=Get(Apps[i]);try{before[i]=Popup(h);Console.WriteLine(Apps[i]+" popup="+before[i]);}finally{notification_setting_free_notification(h);}}
   if(args.Length==0)return 0;
   try {for(int i=0;i<Apps.Length;i++){Set(Apps[i],args[0]=="restore");Console.WriteLine("Verified "+Apps[i]+" popup="+(args[0]=="restore"));}}
   catch {for(int i=0;i<Apps.Length;i++)Set(Apps[i],before[i]);throw;}
   return 0;
  }catch(Exception e){Console.Error.WriteLine(e.Message);return 1;}
 }
 [DllImport(Lib)]static extern int notification_setting_get_setting_by_appid_for_uid(string app,out IntPtr h,uint uid);
 [DllImport(Lib)]static extern int notification_setting_get_pop_up_notification(IntPtr h,[MarshalAs(UnmanagedType.I1)] out bool value);
 [DllImport(Lib)]static extern int notification_setting_set_pop_up_notification(IntPtr h,[MarshalAs(UnmanagedType.I1)] bool value);
 [DllImport(Lib)]static extern int notification_setting_update_setting_for_uid(IntPtr h,uint uid);
 [DllImport(Lib)]static extern int notification_setting_free_notification(IntPtr h);
}
