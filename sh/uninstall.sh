#!/bin/bash

SERVICE=asmodee-werewolf

service $SERVICE stop

rm -f /etc/init.d/$SERVICE
update-rc.d $SERVICE remove
