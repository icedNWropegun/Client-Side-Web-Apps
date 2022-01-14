/* This module contains helper functions resued all over the application  */
import { async } from 'regenerator-runtime'; //For parcel
import { TIMEOUT_SECONDS } from './config'; // app configuration

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took to long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

//AJAX is the "HTTP Library" for the application. Used in Model.
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    //rethrowing error in this catch block to propagate error handling => model.js => controller.js => view
    throw error;
  }
};
