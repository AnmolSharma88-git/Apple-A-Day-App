import RegisterForm from "../components/RegisterForm";

export default function Register() {

    const handleSuccess = () => {
        /*
          Firebase automatically logs the user in
          after successful registration.
    
          Change this route if your student dashboard
          has a different URL.
        */

        window.location.href = "/student";
    };

    return (
        <main>
            <RegisterForm
                onSuccess={handleSuccess}
            />
        </main>
    );
}