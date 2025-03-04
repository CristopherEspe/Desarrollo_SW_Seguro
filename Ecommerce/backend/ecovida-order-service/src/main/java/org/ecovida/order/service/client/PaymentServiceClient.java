package org.ecovida.order.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "payment-service")
public interface PaymentServiceClient {
    @PostMapping("/charge")
    String charge(@RequestParam("amount") Double amount, @RequestParam("paymentMethodId") String paymentMethodId);
}
