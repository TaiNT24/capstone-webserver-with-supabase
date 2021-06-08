import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_KEY
// );

export const supabase = createClient(
  "https://ngbkythjduonfnmwrasm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjYwNzEwNSwiZXhwIjoxOTM4MTgzMTA1fQ.l2koUbo9t8iz6X9xU45tZwNIyEHfZm6nDTVoXnt5L-E"
);

/**
 * @param {number} channelId the currently selected Channel
 */
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
        handleUpdateDevice(payload.new);
      })
      .on("DELETE", (payload) => {
        handleDeleteDevice(payload.old);
      })
      .subscribe();

    //Load initial data
    fetchLogs();
    fetchDevice();

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
      let alt_devices = devices;
      alt_devices.map((e) => {
        if (e.id === updateDevice.id) {
          e.idDevice = updateDevice.idDevice;
        }
        return null;
      });
      setDevices(alt_devices);
      handleUpdateDevice(null);
    }
  }, [updateDevice, devices]);


  // handle event delete device
  useEffect(() => {
    if (deleteDevice) {
      setDevices(devices.filter((device) => device.id !== deleteDevice.id));
    }
  }, [deleteDevice, devices]);

  //Init with 50 rows first
  async function fetchLogs() {
    let { data: log, error } = await supabase
      .from("logs")
      .select("*")
      .order("time", { ascending: false })
      .limit(50);

    if (error) throw error;

    setLogs(log);
  }


  //Init devices
  async function fetchDevice() {
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

/**
 * Insert a new message into the DB
 * @param {string} message The message text
 * @param {number} channel_id
 * @param {number} user_id The author
 */
export const addMessage = async (message, channel_id, user_id) => {
  try {
    let { body } = await supabase
      .from("messages")
      .insert([{ message, channel_id, user_id }]);
    return body;
  } catch (error) {
    console.log("error", error);
  }
};
