import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import moment from "moment";

// axios.defaults.headers.common["apikey"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjYwNzEwNSwiZXhwIjoxOTM4MTgzMTA1fQ.l2koUbo9t8iz6X9xU45tZwNIyEHfZm6nDTVoXnt5L-E";

export const supabase = createClient(
  process.env.REACT_APP_PUBLIC_SUPABASE_URL,
  // process.env.REACT_APP_PUBLIC_SUPABASE_KEY
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjIyNjA3MTA1LCJleHAiOjE5MzgxODMxMDV9.cyBPtsY2EBcRLWPHEmL9nSdUqglFzPv4tZlmPaF3sEw"
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
        setDevices((devices) => [payload.new, ...devices]);
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
              updateDevice.last_connection = moment(
                updateDevice.last_connection
              )
                .utcOffset(+14, true)
                .format();
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
      .order("date_create", { ascending: false });
    // .order("last_connection", { ascending: false });

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
    page = page * 50;

    let { data: staffs, error } = await supabase
      .from("accounts")
      .select("id, email, full_name, date_create, status")
      .eq("role", "staff")
      .order("date_create", { ascending: false })
      .range(page, page + 49);

    if (error) {
      console.log("error_fetchStaff", error);
    }

    return staffs;
  } catch (error) {
    console.log("error_fetchStaff", error);
  }
  return null;
};

export const searchStaffLikeEmail = async (page, email) => {
  try {
    if (!page) page = 0;
    page = page * 50;

    let { error: error1, count } = await supabase
      .from("accounts")
      .select("id", { count: "exact", head: true })
      .eq("role", "staff")
      .like("email", `%${email}%`);

    let { data, error: error2 } = await supabase
      .from("accounts")
      .select("id, email, full_name, date_create, status")
      .eq("role", "staff")
      .like("email", `%${email}%`)
      .order("date_create", { ascending: false })
      .range(page, page + 49);

    if (error1 || error2) {
      console.log("error_fetchStaff", error1, error2);
    }

    console.log("staff: ", data);
    console.log("count: ", count);
    return {
      staffs: data,
      count: count,
    };
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
      .select("id, code");
    // .neq("status", 1);

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
        mac_address: dataUpdate.mac_address.toUpperCase(),
        // status: dataUpdate.status,
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
    row = row * 3;

    let { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("device_id", id)
      .order("date_create", { ascending: false })
      .range(row, row + 2);

    if (error) {
      console.log("error_fetchTaskByVehicleId", error);
      return error;
    }

    return tasks;
  } catch (error) {
    console.log("error_fetchTaskByVehicleId", error);
    return error;
  }
};

// export const loadAvatar = async () => {
//   try {
//     const { data, error } = await supabase.storage.from("avatars").list();

//     if (error) {
//       console.log("error_fetchTaskByVehicleId", error);
//       return error;
//     }

//     console.log("data avatar: " + data);

//     const { signedURL, error2 } = await supabase.storage
//       .from("avatars")
//       .createSignedUrl(data[0].name);

//     return data;
//   } catch (error) {
//     console.log("error_fetchTaskByVehicleId", error);
//     return error;
//   }
// };

export const onCreateNewDevice = async (bodyData) => {
  try {
    let currentTimeStamp = moment().format();

    const { data, error } = await supabase.from("devices").insert([
      {
        code: bodyData.code,
        mac_address: bodyData.mac_address.toUpperCase(),
        date_create: currentTimeStamp,
        status: 0,
        battery: 100,
        last_x: 10,
        last_y: 10,
        direction: 1,
        last_connection: null,
      },
    ]);

    if (error) {
      console.log("error_onCreateNewDevice", error);
      return error;
    }

    return data;
  } catch (error) {
    console.log("error_onCreateNewDevice", error);
    return error;
  }
};

export const onCreateNewStaff = async (bodyData) => {
  try {
    let isTrue = await checkExpired();

    if (isTrue) {
      let data = {
        email: bodyData.email,
        // password: "123456",
        // role: "staff",
        full_name: bodyData.fullname,
        birthday: moment(bodyData.birthday),
        // avatar: "avatar_123",
        // status: 0,
      };

      let token = supabase.auth.currentSession.access_token;

      let res = await axios.post(
        process.env.REACT_APP_URL_AVS_SERVER +
          process.env.REACT_APP_PATH_CREATE_NEW_STAFF,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Access-Control-Allow-Origin': "/*"
          },
        }
      );

      if (res.error) {
        console.log("error_onCreateNewDevice: ", res.error);
        return res;
      }
      console.log("data: ", res);

      return res;
    } else {
      //push login page
    }
  } catch (error) {
    console.log("error_onCreateNewDevice", error);
    return error;
  }
};

export const onInsertMappingDevice = async (id, devices) => {
  try {
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
      console.log("error_onInsertMappingDevice", error);
      return error;
    } else {
      return true;
    }
  } catch (error) {
    console.log("error_onInsertMappingDevice", error);
    return error;
  }
};

async function checkExpired() {
  let now = Math.floor(new Date().getTime() / 1000);

  let session = supabase.auth.session(); // refresh_token, expires_at
  let expires_at = session.expires_at;

  if (expires_at < now) {
    let refresh_token = session.refresh_token;
    const { error, data } = await supabase.auth.api.refreshAccessToken(
      refresh_token
    );

    if (error) {
      console.log("error_checkExpired: ", error);
      return false;
    }
    supabase.auth.setSession(data);
    return true;
  }
  return true;
}

async export function checkServer() {
  let res = await axios.get(
    process.env.REACT_APP_URL_AVS_SERVER +
      process.env.REACT_APP_PATH_CREATE_NEW_STAFF
  );
    console.log("res: ", res);

  if(res !== null){
    return true;
  }
}
