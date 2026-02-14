import axios from "axios";

export async function getLongLatFromCity(city: string) {
  try {
    const response = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`,
    );
    if (!response.data.results) {
      throw new Error("Enter a valid city name");
    }
    const { longitude, latitude } = response.data.results[0];
    return { latitude, longitude };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getWeatherData(latitude: number, longitude: number) {
  try {
    const response = await axios.get(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&timezone=Asia/Kolkata&daily=temperature_2m_max,temperature_2m_min&temperature_unit=celsius&past_days=31`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
