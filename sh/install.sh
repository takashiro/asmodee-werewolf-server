#!/bin/bash

ROOTDIR=/opt/asmodee-werewolf
USER=karuta
SERVICE=asmodee-werewolf

# Generate service script
cat initd-header.sh > $SERVICE
echo "" >> $SERVICE
echo "ROOTDIR=$ROOTDIR" >> $SERVICE
echo "LOGDIR=$LOGDIR" >> $SERVICE
echo "USER=$USER" >> $SERVICE
cat initd-body.sh >> $SERVICE

# Install service script
mv $SERVICE /etc/init.d/$SERVICE
chmod 755 /etc/init.d/$SERVICE
update-rc.d $SERVICE defaults
