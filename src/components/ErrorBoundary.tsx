import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: any;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("🔥 Map crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[500px] flex items-center justify-center bg-red-50 rounded-xl">
          <p className="text-red-600 font-semibold">
            Map failed to load
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;