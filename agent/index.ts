import Java from "frida-java-bridge";
import { log_info, log_error, log_warning, log_debug, log_success } from "./logger.js";

log_info("Starting agent");


function loaded_classes() {
    var classes = Java.enumerateLoadedClassesSync();
    for (var i = 0; i < classes.length; i++) {
        log_info(classes[i]);
    }
}

//loaded_classes();


var do_dlopen_address: NativePointer | null = null;
var call_constructor_address: NativePointer = new NativePointer(0);
var libmain_fully_loaded: boolean = false;


var linker64 = Process.findModuleByName("linker64")?.enumerateSymbols();

if (linker64) {
    for (var i = 0; i < linker64.length; i++) {
        if (linker64[i].name.indexOf("do_dlopen") >= 0){
            log_success("Found do_dlopen at " + linker64[i].address.toString());
            do_dlopen_address = linker64[i].address;
        }
        if (linker64[i].name.indexOf("call_constructor") >= 0){
            log_success("Found call_constructor at " + linker64[i].address.toString());
            call_constructor_address = linker64[i].address;
        }
    }
}

if (do_dlopen_address && call_constructor_address) {
    Interceptor.attach(do_dlopen_address, {
        onEnter: function(args) {
            var library_name = args[0].readCString();
            log_info("do_dlopen called with library: " + library_name);
            if (library_name) {
                if (library_name.indexOf("libmain") >= 0) {
                    log_info("libmain found, calling call_constructor");
                    Interceptor.attach(call_constructor_address, {
                        
                        onEnter: function(args) {
                            
                            if (!libmain_fully_loaded) {
                                libmain_fully_loaded = true;
                                log_success("libmain fully loaded in memory");
                                var libmain_address = Process.findModuleByName("libmain.so")?.base;
                                if (libmain_address) {
                                    log_debug("libmain address: " + libmain_address);
                                    hook_libmain(libmain_address, 0x9074C, 1);
                                } else {
                                    log_error("libmain not found in memory");
                                }
                            }
                        },
                        onLeave: function(retval) {
                            //do nothing
                        }
                    });
                }
            }
        },
        onLeave: function(retval) {
            //do nothing
        }
    });
}


function hook_libmain(BaseAddress: NativePointer, offset: any, number_of_functions: number) {
    if (number_of_functions === 1) {
        var function_address = BaseAddress.add(offset);
        Interceptor.attach(function_address, {
            onEnter: function(args) {
                var player = args[1].add(577).readCString()
                log_info("DODAMAGE FUNCTION CALLED");
                log_info("damage value: " + args[0].toInt32());
                log_info("actor: " + args[2].add(577).readCString());
                log_info("player: " + args[1].add(577).readCString());
                if (player) {
                    if (player.indexOf("unarmed") >= 0) {
                        log_info("unarmed found, calling damage function");
                        args[0] = ptr(0x0)
                        log_info("damage value set to 0");
                        log_info("damage value: " + args[0].toInt32());
                    }
                }

            },
            onLeave: function(retval) {
                log_info("function returned with retval: " + retval);
            }
        });
    }
}