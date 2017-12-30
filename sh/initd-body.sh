
SERVICE=asmodee-werewolf
BIN="node app.js"
PIDFILE=/var/run/$SERVICE.pid

check_status() {
	if [ ! -f "$PIDFILE" ]; then
		return 1
	fi

	local PID=$(cat "$PIDFILE")
	if [ -z "$PID" ] || ! kill -0 "$PID" 2>/dev/null; then
		rm -f "$PIDFILE"
		return 1
	fi

	return 0
}

start() {
	if check_status; then
		echo "$SERVICE is already running." >&2
		return 1
	fi
	echo "Starting $SERVICE..." >&2
	cd $ROOTDIR
	local CMD="$BIN > /dev/null & echo \$!"
	su -c "$CMD" $USER > "$PIDFILE" &
	echo "$SERVICE is running." >&2
}

stop() {
	if ! check_status; then
		echo "$SERVICE is not running." >&2
		return 1
	fi
	echo "Stopping $SERVICE..." >&2
	kill -15 $(cat $PIDFILE)
	rm -f "$PIDFILE"
	echo "$SERVICE is stopped." >&2
}

status() {
	if check_status; then
		echo "$SERVICE is running." >&2
	else
		echo "$SERVICE is not running." >&2
	fi
}

case "$1" in
	start)
		start
		;;
	stop)
		stop
		;;
	status)
		status
		;;
	retart)
		stop
		start
		;;
	*)
	echo "Usage: $0 {start|stop|restart|status}"
esac
