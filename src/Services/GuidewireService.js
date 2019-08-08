import { createClient } from "@gw/ui-integration-sdk";
import { getUser } from "./AuthService";


class GuidewireApiService {

  static getServiceableFormData(candidateId) {
    return getUser().then(function (user) {
      var gwClient = createClient("ontellus", "records", user.access_token);
      return gwClient.getClient().then(function (client) {
        return Promise.all([client, client.getContext()]);
      }).then(function (values) {
        return values[0].httpRequest("GET", "/serviceables/" + candidateId);
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        return data;
      })
    })
  }

  static getServiceableCandidates() {
   return getUser().then(function (user) {
      var gwClient = createClient("ontellus", "records", user.access_token);
      return gwClient.getClient().then(function (client) {
        return Promise.all([client, client.getContext()]);
      }).then(function (values) {
      return values[1].candidates;
      })
    })
  }

  static createServiceRequest(orderId, serviceableId) {
   return getUser().then(function (user) {
      var gwClient = createClient("ontellus", "records", user.access_token);

      var refNumber = orderId
      var jobId = orderId

      var serviceRequest = {
        "referenceNumber": refNumber,
        "serviceableId": serviceableId,
        "referenceId1": jobId
      }
      return gwClient.getClient().then(function (client) {
        return Promise.all([client, client.invokeWithoutRefresh("createService", serviceRequest)])
      })
    })

    //.then(function(values) {
    //  values[0].navigate("servicerequest", values[1].referenceNumber);
    //});
  }
}

export default GuidewireApiService;