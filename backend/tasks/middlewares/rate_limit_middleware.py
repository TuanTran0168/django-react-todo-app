import time
import logging
from django.http import JsonResponse

logger = logging.getLogger("rate_limit")
logging.basicConfig(level=logging.INFO)

request_history_per_ip = {}

blocked_ips = {}

MAX_REQUESTS = 50
WINDOW_SECONDS = 30
BLOCK_DURATION = 5
CLEANUP_INTERVAL = 300

_last_cleanup_time = time.time()


def cleanup_old_ips():
    now = time.time()

    for ip, block_expire_time in list(blocked_ips.items()):
        if block_expire_time < now:
            del blocked_ips[ip]

    for ip, timestamps in list(request_history_per_ip.items()):
        recent_timestamps = []
        for timestamp in timestamps:
            if now - timestamp < WINDOW_SECONDS:
                recent_timestamps.append(timestamp)
        if recent_timestamps:
            request_history_per_ip[ip] = recent_timestamps
        else:
            del request_history_per_ip[ip]


def log_current_blocked_ips():
    if not blocked_ips:
        return
    log_message = "Currently blocked IPs:\n"
    current_time = time.time()
    for ip, block_expire_time in blocked_ips.items():
        remaining_seconds = int(block_expire_time - current_time)
        log_message += f"  - {ip} blocked for {remaining_seconds}s\n"
    logger.info(log_message)


class RateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        global _last_cleanup_time

        client_ip = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR"))
        current_time = time.time()
        print(f"=========================================== RATE LIMIT FOR IP: {client_ip} ===========================================")
        print(f"=========================================== blocked_ips: {blocked_ips} ===========================================")

        if current_time - _last_cleanup_time > CLEANUP_INTERVAL:
            cleanup_old_ips()
            _last_cleanup_time = current_time

        block_expire_time = blocked_ips.get(client_ip)
        if block_expire_time:
            if current_time < block_expire_time:
                remaining_seconds = int(block_expire_time - current_time)
                logger.info(f"Blocked request from {client_ip}, {remaining_seconds}s remaining")
                log_current_blocked_ips()
                return JsonResponse({
                    "detail": f"Too many requests. Try again in {remaining_seconds} seconds.",
                    "blocked_for_seconds": remaining_seconds
                }, status=429)
            else:
                del blocked_ips[client_ip]

        if client_ip not in request_history_per_ip:
            request_history_per_ip[client_ip] = []

        recent_requests = []
        for timestamp in request_history_per_ip[client_ip]:
            if current_time - timestamp < WINDOW_SECONDS:
                recent_requests.append(timestamp)
        recent_requests.append(current_time)
        request_history_per_ip[client_ip] = recent_requests

        if len(recent_requests) > MAX_REQUESTS:
            blocked_ips[client_ip] = current_time + BLOCK_DURATION
            request_history_per_ip[client_ip] = [] # Clear when blocked
            logger.info(f"Blocking IP {client_ip} for {BLOCK_DURATION}s due to too many requests")
            log_current_blocked_ips()
            return JsonResponse({
                "detail": f"Too many requests. IP blocked for {BLOCK_DURATION} seconds.",
                "blocked_for_seconds": BLOCK_DURATION
            }, status=429)

        return self.get_response(request)
