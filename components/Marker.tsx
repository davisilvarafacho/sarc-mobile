import { Marker, type Region } from "react-native-maps";

export function Marker() {
    return (
        <Marker
            coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
            title={"This is a marker"}
            description={"This is a marker example"}
    )
}