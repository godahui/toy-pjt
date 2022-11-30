import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// const API_KEY = "84b4ea4ed79af1c26abc634f992c64fd";
const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atomosphere: "fog",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstrorm: "lightning",
};

export default function App() {
  const [region, setRegion] = useState();
  const [city, setCity] = useState();
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setRegion(location[0].region);
    setCity(location[0].city);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.continer}>
      {ok ? (
        <>
          <View style={styles.city}>
            <Text style={styles.cityName}>
              {region} {city}
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={styles.weather}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {days.length === 0 ? (
              <View style={styles.day}>
                <ActivityIndicator
                  color="white"
                  style={{ marginTop: 10 }}
                  size="large"
                />
              </View>
            ) : (
              days.map((day, index) => (
                <View key={index} style={styles.day}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.temp}>
                      {parseFloat(day.temp.day).toFixed(1)}
                    </Text>
                    <Fontisto
                      name={icons[day.weather[0].main]}
                      size={80}
                      color="white"
                      style={{}}
                    />
                  </View>

                  <Text style={styles.description}>{day.weather[0].main}</Text>
                  <Text style={styles.tinyText}>
                    {day.weather[0].description}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </>
      ) : (
        <>
          <Text>위치 정보를 허용해야 사용할 수 있습니다.</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    backgroundColor: "orange",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 30,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 5,
  },
  weather: {},
  day: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: SCREEN_WIDTH,
    padding: 20,
  },
  temp: {
    fontSize: 108,
    fontWeight: "700",
  },
  description: {
    marginTop: -20,
    fontSize: 40,
  },
  tinyText: {
    fontSize: 20,
  },
});
