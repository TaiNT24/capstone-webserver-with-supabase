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

export const useStoreGetDevice = (props) => {
  const [devices, setDevices] = useState();
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

    //Load initial data
    loadDevice();

    // Cleanup on unmount
    return () => {
      console.log("useStoreGetDevice: unmounted");

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
    // eslint-disable-next-line
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
    // eslint-disable-next-line
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
    // We can export computed values here to map the authors to each message
    devices: devices,
  };
};

export const useStoreGetLog = (props) => {
  const [logs, setLogs] = useState();

  // set up listeners
  useEffect(() => {
    const logListener = supabase
      .from("logs")
      .on("INSERT", (payload) => {
        setLogs((logs) => [...logs, payload.new]);
      })
      .subscribe();

    //Load initial data
    fetchLogs();

    // Cleanup on unmount
    return () => {
      console.log("useStoreGetLog: unmounted");

      logListener.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

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

  function clearLogs() {
    setLogs([]);
  }

  return {
    // We can export computed values here to map the authors to each message
    listLog: logs,
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
      // data: staffs,
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
      .neq("status", 1); // 0: active, 1: inactive

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
    const { error } = await supabase
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

      const { error } = await supabase
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

export const updateVehicle = async (id, dataUpdate) => {
  try {
    const { data, error } = await supabase
      .from("devices")
      .update({
        code: dataUpdate.code,
        mac_address: dataUpdate.mac_address,
        status: dataUpdate.status,
      })
      .eq("id", id);

    if (error) {
      console.log("error_updateVehicle", error);
      return error;
    }
    return data;
  } catch (error) {
    console.log("error_updateVehicle", error);
    return error;
  }
};

export const fetchAllStaff = async () => {
  try {
    let { data: staffs, error } = await supabase
      .from("accounts")
      .select("id, email, full_name, date_create, status")
      .eq("role", "staff")
      .order("date_create", { ascending: false });

    if (error) {
      console.log("error_fetchAllStaff", error);
    }

    return staffs;
  } catch (error) {
    console.log("error_fetchAllStaff", error);
  }
  return null;
};

export const fetchTask = async (loadCount) => {
  try {
    // let page = loadCount * 10;

    let { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .order("date_create", { ascending: false });
    // .range(page, page + 10)
    // .limit(10);

    if (error) {
      console.log("error_fetchTask", error);
      return error;
    }

    return tasks;
  } catch (error) {
    console.log("error_fetchTask", error);
    return error;
  }
};

export const fetchTaskFilterByDevice = async (deviceFilter) => {
  try {
    let { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .in("device_id", deviceFilter)
      .order("date_create", { ascending: false })
      .limit(10);

    if (error) {
      console.log("error_fetchTask", error);
      return error;
    }

    return tasks;
  } catch (error) {
    console.log("error_fetchTask", error);
    return error;
  }
};

export const fetchTaskDetailById = async (id) => {
  try {
    let { data: taskDetail, error } = await supabase
      .from("location_history_detail")
      .select("*")
      .eq("task_id", id)
      .order("date_create", { ascending: true });

    if (error) {
      console.log("error_fetchTaskDetailById", error);
      return error;
    }

    return taskDetail;
  } catch (error) {
    console.log("error_fetchTaskDetailById", error);
    return error;
  }
};

export const fetchTaskByVehicleId = async (id, row) => {
  try {
    let { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("device_id", id)
      .order("date_create", { ascending: false })
      .range(row * 3 , row + 2);

    if (error) {
      console.log("error_fetchTaskByVehicleId", error);
      return error;
    }
    debugger

    return tasks;
  } catch (error) {
    console.log("error_fetchTaskByVehicleId", error);
    return error;
  }
};