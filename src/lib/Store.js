import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

axios.defaults.headers.common["apikey"] =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjYwNzEwNSwiZXhwIjoxOTM4MTgzMTA1fQ.l2koUbo9t8iz6X9xU45tZwNIyEHfZm6nDTVoXnt5L-E";

// export const supabase = createClient(
//   process.env.PUBLIC_SUPABASE_URL,
//   process.env.PUBLIC_SUPABASE_KEY
// );

export const supabase = createClient(
  "https://ngbkythjduonfnmwrasm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjYwNzEwNSwiZXhwIjoxOTM4MTgzMTA1fQ.l2koUbo9t8iz6X9xU45tZwNIyEHfZm6nDTVoXnt5L-E"
);

export const useStore = (props) => {
  const [logs, setLogs] = useState([]);
  const [devices, setDevices] = useState([]);
  const [updateDevice, handleUpdateDevice] = useState(null);
  const [deleteDevice, handleDeleteDevice] = useState(null);

  // set up listeners
  useEffect(() => {
    const logListener = supabase
      .from("logs")
      .on("INSERT", (payload) => {
        setLogs((logs) => [...logs, payload.new]);
      })
      .subscribe();

    const deviceListener = supabase
      .from("devices")
      .on("INSERT", (payload) => {
        setDevices((devices) => [...devices, payload.new]);
      })
      .on("UPDATE", (payload) => {
        console.log(payload);
        handleUpdateDevice(payload.new);
      })
      .on("DELETE", (payload) => {
        handleDeleteDevice(payload.old);
      })
      .subscribe();

    //Load initial data
    fetchLogs();
    loadDevice();

    // Cleanup on unmount
    return () => {
      logListener.unsubscribe();
      deviceListener.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  // handle event update device
  useEffect(() => {
    if (updateDevice) {
      if (devices) {
        console.log("updateDevice: " + devices);
        setDevices((devices) =>
          devices.map((e) => {
            if (e.id === updateDevice.id) {
              e.code = updateDevice.code;
            }
            return e;
          })
        );
      }
    }

    // return () => {
    //   setDevices(devices);
    // };
  }, [updateDevice]);

  // handle event delete device
  useEffect(() => {
    if (deleteDevice) {
      if (devices) {
        setDevices(devices.filter((device) => device.id !== deleteDevice.id));
      }
    }

    // return () => {
    //   setDevices(devices);
    // };
  }, [deleteDevice]);

  //Init with 50 rows first
  async function fetchLogs() {
    let { data: log, error } = await supabase
      .from("logs")
      .select("*")
      .order("date_create", { ascending: false })
      .limit(50);

    if (error) throw error;

    setLogs(log);
  }

  async function loadDevice() {
    let { data: devices, error } = await supabase.from("devices").select("*");

    if (error) throw error;

    setDevices(devices);
  }

  function clearLogs() {
    setLogs([]);
  }

  return {
    // We can export computed values here to map the authors to each message
    listLog: logs,
    devices: devices,
    clearLogs: clearLogs,
  };
};

export const fetchStaff = async (page) => {
  try {
    if (!page) page = 0;
    page = page * 8;

    let { data: staffs, error } = await supabase
      .from("accounts")
      .select("id, email, full_name, date_create, status")
      .eq("role", "staff")
      .order("date_create", { ascending: false })
      .range(page, page + 7);

    if (error) {
      console.log("error_fetchStaff", error);
    }

    return staffs;
  } catch (error) {
    console.log("error_fetchStaff", error);
  }
  return null;
};

export const fetchStaffById = async (id) => {
  try {
    let { data: staffs, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", id);

    if (error) {
      console.log("error_fetchStaff", error);
    }
    return staffs[0];
  } catch (error) {
    console.log("error_fetchStaff", error);
  }
  return null;
};

export const fetchStaffCount = async () => {
  try {
    let {
      data: staffs,
      error,
      count,
    } = await supabase
      .from("accounts")
      .select("id", { count: "exact", head: true })
      .eq("role", "staff");

    if (error) {
      console.log("error_fetchStaffCount", error);
    }
    return count;
  } catch (error) {
    console.log("error_fetchStaffCount", error);
  }
  return null;
};

export const updateStatusStaff = async (id, status) => {
  let statusCode = 0;

  if (!status) {
    // true: active <- 0, false: inactive <- 1
    statusCode = 1;
  }

  try {
    const { data, error } = await supabase
      .from("accounts")
      .update({ status: statusCode })
      .eq("id", id);

    if (error) {
      console.log("error_updateStatusStaff", error);
    }
    return data[0];
  } catch (error) {
    console.log("error_updateStatusStaff", error);
  }
  return null;
};

export const fetchDevice = async () => {
  try {
    let { data: devices, error } = await supabase
      .from("devices")
      .select("id, name, code")
      .eq("status", 0); // 0: active, 1: inactive

    if (error) {
      console.log("error_fetchDevice", error);
    }

    return devices;
  } catch (error) {
    console.log("error_fetchDevice", error);
  }
  return null;
};

export const fetchMappingDevice = async (id) => {
  try {
    let { data: mapping_device, error } = await supabase
      .from("mapping_device")
      .select("*")
      .eq("user_id", id);

    if (error) {
      console.log("error_fetchMappingDevice", error);
    }

    return mapping_device;
  } catch (error) {
    console.log("error_fetchMappingDevice", error);
  }
  return null;
};

export const updateMappingDevice = async (id, devices) => {
  let error1 = null;
  let error2 = null;
  try {
    const { data, error } = await supabase
      .from("mapping_device")
      .delete()
      .eq("user_id", id);

    if (!error) {
      let listDeviceInsert = [];

      devices.forEach((device) => {
        listDeviceInsert.push({
          user_id: id,
          device_id: device.id,
        });
      });

      const { data, error } = await supabase
        .from("mapping_device")
        .insert(listDeviceInsert);

      if (error) {
        error2 = error;
        console.log("error_fetchMappingDevice", error);
      }
    } else {
      error1 = error;
      console.log("error_fetchMappingDevice", error);
    }

    if (!error1 && !error2) {
      return true;
    }
  } catch (error) {
    console.log("error_fetchMappingDevice", error);
  }
  return false;
};

export const fetchAllDevice = () => {
  const [devices, setDevices] = useState([]);
  const [updateDevice, handleUpdateDevice] = useState(null);
  const [deleteDevice, handleDeleteDevice] = useState(null);

  // set up listeners
  useEffect(() => {
    const deviceListener = supabase
      .from("devices")
      .on("INSERT", (payload) => {
        setDevices((devices) => [...devices, payload.new]);
      })
      .on("UPDATE", (payload) => {
        console.log(payload);
        handleUpdateDevice(payload.new);
      })
      .on("DELETE", (payload) => {
        handleDeleteDevice(payload.old);
      })
      .subscribe();

    loadDevice();

    return () => {
      deviceListener.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  // handle event update device
  useEffect(() => {
    if (updateDevice) {
      if (devices) {
        console.log("updateDevice: " + devices);
        setDevices((devices) =>
          devices.map((e) => {
            if (e.id === updateDevice.id) {
              e = updateDevice;
            }
            return e;
          })
        );
      }
    }

    // return () => {
    //   setDevices(devices);
    // };
  }, [updateDevice]);

  // handle event delete device
  useEffect(() => {
    if (deleteDevice) {
      if (devices) {
        setDevices(devices.filter((device) => device.id !== deleteDevice.id));
      }
    }

    // return () => {
    //   setDevices(devices);
    // };
  }, [deleteDevice]);

  async function loadDevice() {
    let { data: devices, error } = await supabase
      .from("devices")
      .select("*")
      .order("last_connection", { ascending: false });

    if (error) throw error;

    setDevices(devices);
  }

  return {
    devices: devices,
  };
};
