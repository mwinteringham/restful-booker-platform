package com.automationintesting.unit;

import com.github.tomakehurst.wiremock.common.ConsoleNotifier;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import model.room.Room;
import model.room.Rooms;
import org.approvaltests.Approvals;
import org.junit.Rule;
import org.junit.Test;
import org.springframework.http.ResponseEntity;
import requests.RoomRequests;

import static com.github.tomakehurst.wiremock.client.WireMock.*;

public class BuildReportTest {

    @Rule
    public WireMockRule roomApi = new WireMockRule(WireMockConfiguration.options().notifier(new ConsoleNotifier(true)).port(3001));

    @Test
    public void testGettingRoomSearchResults(){
        roomApi.stubFor(get("/room")
                .willReturn(
                    aResponse()
                        .withHeader("Content-Type","application/json")
                        .withBody("{\"rooms\":[{\"roomid\":1,\"roomNumber\":101,\"type\":\"Twin\",\"beds\":2,\"accessible\":false,\"details\":\"Wifi, TV, Mini-bar\"}, {\"roomid\":2,\"roomNumber\":102,\"type\":\"Single\",\"beds\":3,\"accessible\":true,\"details\":\"Wifi, TV, Mini-bar\"}]}")
                        .withStatus(200)));

        RoomRequests roomRequests = new RoomRequests();

        ResponseEntity<Rooms> roomSearchResults = roomRequests.searchForRooms();

        Approvals.verify(roomSearchResults.getBody().getRooms().toString());
    }

    @Test
    public void testGettingBookingsSearchResults(){
        roomApi.stubFor(get("/room/1")
                .willReturn(
                    aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"roomid\":1,\"roomNumber\":101,\"type\":\"Twin\",\"beds\":2,\"accessible\":false,\"details\":\"Wifi, TV, Mini-bar\",\"bookings\":[{\"bookingid\":1,\"roomid\":1,\"firstname\":\"James\",\"lastname\":\"Dean\",\"totalprice\":100,\"depositpaid\":true,\"bookingdates\":{\"checkin\":\"2018-02-26\",\"checkout\":\"2018-02-26\"}},{\"bookingid\":2,\"roomid\":1,\"firstname\":\"Mark\",\"lastname\":\"Winteringham\",\"totalprice\":200,\"depositpaid\":false,\"bookingdates\":{\"checkin\":\"2018-10-29\",\"checkout\":\"2018-10-29\"}}]}")
                        .withStatus(200)
                ));

        RoomRequests roomRequests = new RoomRequests();

        ResponseEntity<Room> roomSearchResults = roomRequests.searchForSpecificRoom("1");

        Approvals.verify(roomSearchResults.getBody().toString());
    }

}
