import React from "react";
import {Button, Divider, Form, Input, Link} from "@heroui/react";
import {Icon} from "@iconify/react";
import useThemeToggle from "@/hooks/useThemeToggle";
import useHandleSubmit from "@/hooks/useHandleSubmit";

const AuthLogin = () => {
    const {theme, toggleTheme} = useThemeToggle();
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const handleSubmit = useHandleSubmit()

    const redirectToCalendar = () => {
        window.location.href = "/calendar";
    }

    return (
        <main className="bg-background flex min-h-screen items-center justify-center p-4">
            <div className="bg-background-100 relative flex w-full max-w-sm flex-col gap-4 rounded-lg p-6 shadow-md">
                <Button 
                isIconOnly 
                variant="light" 
                className="absolute right-2 top-2"
                onPress={toggleTheme}
                >
                <Icon 
                    icon={theme === "light" ? "lucide:moon" : "lucide:sun"} 
                    width={20} 
                />
                </Button>
                <h2 className="text-xl font-medium">Calendario</h2>
                <Form className="flex flex-col gap-3" onSubmit={(e) => handleSubmit(e, '/api/users', {error: 'Error al iniciar sesión', success: 'Inicio exitoso'}, redirectToCalendar)}>
                    <Input
                        label="Usuario"
                        labelPlacement="inside"
                        placeholder="Ingrese su nombre de usuario"
                        name="name"
                        type="text"
                        variant="bordered"
                    />
                    <Input
                        label="Contraseña"
                        labelPlacement="inside"
                        placeholder="Ingrese su contraseña"
                        name="password"
                        type={isVisible ? "text" : "password"}
                        variant="bordered"
                        endContent={
                            <button type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                                <Icon
                                className="text-2xl pointer-events-none text-default-400"
                                icon="solar:eye-closed-linear"
                                />
                            ) : (
                                <Icon
                                className="text-2xl pointer-events-none text-default-400"
                                icon="solar:eye-bold"
                                />
                            )}
                            </button>
                        }
                    />
                    <Button className="w-full" color="secondary" type="submit">
                        Ingrese
                    </Button>
                </Form>
                <Divider />
                <p className="text-small text-center text-default-400">Si es la primera vez que ingresa, se le creará un usuario automáticamente</p>
            </div>
        </main>
    );
}

export default AuthLogin